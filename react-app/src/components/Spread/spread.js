import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import { getAPIGames, storeGames, storeWeek } from '../../store/games';
import { getUserPickEmPicks, postUserPickEmPick, deleteUserPickEmPick, checkUserPickEmPicks } from '../../store/pickEmPicks';
import { getUserElimPicks, checkUserElimPicks } from '../../store/elimPicks';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import CommentListGuest from '../CommentListGuest/commentListGuest';
import './spread.css'
import { checkUserSpreadBets, getUserSpreadBets, postUserSpreadBet } from '../../store/spreadBets';
import { checkUserOverUnderBets, getUserOverUnderBets } from '../../store/overUnderBets';

const SpreadPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);
  const sessionUser = useSelector((state) => state.session.user)
  // const userPrognosticoins = sessionUser.prognosticoins
  const [selectedTeams, setSelectedTeams] = useState({});
  const [betAmounts, setBetAmounts] = useState({});


  useEffect(() => {
    const lastGamesFetchTimestamp = localStorage.getItem('lastGamesFetchTimestamp');
    const currentTime = Date.now();
    const fetchGamesAndWeek = async () => {
      try {
        localStorage.setItem('lastGamesFetchTimestamp', String(currentTime));
          // If enough time has passed, fetch data from the API and store it in the redux store
          dispatch(getAPIGames());
          dispatch(storeGames());
          dispatch(storeWeek());
          dispatch(checkUserSpreadBets());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (
      !lastGamesFetchTimestamp || currentTime - Number(lastGamesFetchTimestamp) > 1 * 60 * 1000) {
      fetchGamesAndWeek();
    }
    // Fetch non-API backend data
    dispatch(getTeams());
    dispatch(getComments());
    dispatch(storeWeek());
    dispatch(storeGames());
    dispatch(getUserElimPicks());
    dispatch(checkUserElimPicks());
    dispatch(getUserPickEmPicks())
    dispatch(checkUserPickEmPicks())
    dispatch(getUserOverUnderBets())
    dispatch(checkUserOverUnderBets())
    dispatch(getUserSpreadBets())
    dispatch(checkUserSpreadBets())
  }, [dispatch]);

  const handleTeamChange = (team, gameID) => {
    setSelectedTeams({ ...selectedTeams, [gameID]: team });
  };

  const handleSpreadSliderChange = (sliderOption, e) => {
    e.preventDefault();
    const newBetAmounts = { ...betAmounts, [sliderOption]: parseInt(e.target.value) };
    setBetAmounts(newBetAmounts);
  };

  const spreadBetHandler = (gameId, selectedTeam, betAmount, spread) => {
    dispatch(postUserSpreadBet(gameId, selectedTeam, betAmount, currentWeek, spread))
      .then(() => {
        setSelectedTeams({});
        setBetAmounts({});

        dispatch(getUserSpreadBets());
      });
  };


  if (!sessionUser) {
    return (
      <>
        <div className='spread-no-user-div'>
        <p className='spread-loading-ph'>Please log in to play a game!</p>
        <CommentListGuest />
        </div>
      </>
    );
  }

  if (!currentWeek || !allGames) {
    return <p className='spread-loading-ph'>Loading...</p>;
  }

  let games;

  if (allGames) {
    games = allGames.filter((game) => game.week == currentWeek);
  }

  return (
    <>
    <div className='spread-all-container-div'>
      <div className='spread-title-div'>
        <h2>SPREAD WAGERS</h2>
        {currentWeek && <h3 className='week-title'>WEEK {currentWeek}</h3>}
      </div>
      <div className='spread-instruction-div'>
        Use your prognosticoins <img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /> (granted weekly) to place spread bets on the team you think will beat the listed spread.
        You can check your current bets on your profile.
        All bets and spread lines are locked in permanently when submitted!
      </div>
      {games && games.length && allTeams && allTeams.length ? (
        <div className='spread-all-games-div'>
            {games.map((game) => {
                const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
                const awayTeam = allTeams.find((team) => team.name === game.away_team_name);
                const sliderOption = `slider=${game.id}`;
                const currentBetAmount = betAmounts[sliderOption] || 0;
                const calculateReturnOnWin = (betAmount) => {
                return betAmount + betAmount / 1.1;
                };
            return (
              <div className={`spread-single-game-div ${game.completed ? 'completed' : (game.over_under === 0 ? 'in-progress' : '')}`} key={game.id}>
                <div className='spread-game-teams-div'>
                  <div className='spread-team-left'>
                    <img className='spread-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`} />
                    {game.away_team_name}
                  </div>
                  <div className='spread-at-between-logos'>
                    @
                  </div>
                  <div className='spread-team-right'>
                    <img className='spread-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    {game.home_team_name}
                  </div>
                </div>
                <div className='spread-game-details'>
                {game.completed ? (
                    <div className='spread-final-score'>
                      Final: {game.away_team_score} - {game.home_team_score}
                      <br />
                      {game.away_team_score > game.home_team_score
                        ? `${game.away_team_name} victory`
                        : `${game.home_team_name} victory`}
                    </div>
                  ) : (
null
                  )}
                  {!game.completed && (
                    <>
                      <div className='spread-game-spread-div' hidden={game.over_under == 0}>Spread: {game.spread === 'Game finished' ? 'Betting Closed' : game.spread}</div>
                      <div className='spread-game-over-under-div'>Over/Under: {game.over_under == 0 ? 'Betting Closed' : game.over_under}</div>
                      <div className='spread-input-overall-div' hidden={game.spread === 0}>
                        <label>
                            <input
                            hidden={game.spread === 0}
                            type="radio"
                            name={`team-${game.id}`}
                            value={game.home_team_name}
                            checked={selectedTeams[game.id] === game.home_team_name}
                            onChange={() => handleTeamChange(game.home_team_name, game.id)}
                            />
                            {game.home_team_name}
                        </label>

                        <label>
                            <input
                            hidden={game.spread === 0}
                            type="radio"
                            name={`team-${game.id}`}
                            value={game.away_team_name}
                            checked={selectedTeams[game.id] === game.away_team_name}
                            onChange={() => handleTeamChange(game.away_team_name, game.id)}
                            />
                            {game.away_team_name}
                        </label>
                        </div>

                        <div hidden={game.spread === 0} className='spread-bet-range-div'>
                        <input
                            hidden={game.spread === 0}
                            type="range"
                            name={`slider-${game.id}`}
                            min={0}
                            max={sessionUser.prognosticoins}
                            value={betAmounts[`slider-${game.id}`] || 0}
                            onChange={(e) => handleSpreadSliderChange(`slider-${game.id}`, e)}
                        />
                        {betAmounts[`slider-${game.id}`] > 0 && (
                            <div>
                            <div className='spread-current-bet-div'>Current Bet:</div>
                            <div className='spread-bet-amount'>{betAmounts[`slider-${game.id}`]} Prognosticoins</div>
                            </div>
                        )}
                        <div className='spread-return-div'>
                            {betAmounts[`slider-${game.id}`] > 0 && (
                            <span>Total Return on Win: {calculateReturnOnWin(betAmounts[`slider-${game.id}`]).toFixed(2)}</span>
                            )}
                        </div>
                        <button
                            className='spread-submit-button'
                            onClick={() => spreadBetHandler(game.id, selectedTeams[game.id], betAmounts[`slider-${game.id}`], game.spread)}
                            hidden={betAmounts[`slider-${game.id}`] < 1 || !selectedTeams[game.id]}
                        >
                            Submit Bet
                        </button>
                        </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No games available for the current week.</p>
      )}
        {sessionUser && (
                <>
                <div className='main-commentform-div'>
                <CommentForm />
              </div>
              <div className='main-commentlist-div'>
                <CommentList />
              </div>
                </>
            )}
      </div>
    </>
  );
};


export default SpreadPage;
