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
import './overUnder.css'
import { checkUserOverUnderBets, getUserOverUnderBets, postUserOverUnderBet } from '../../store/overUnderBets';
import { authenticate } from '../../store/session';
import { checkUserSpreadBets, getUserSpreadBets } from '../../store/spreadBets';

const OverUnderPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);
  const sessionUser = useSelector((state) => state.session.user)
  // const userPrognosticoins = sessionUser.prognosticoins
//   const userOverUnderBets = useSelector(state => state.overUnderBets.userOverUnderBets)
//   const [betAmount, setBetAmount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
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
          dispatch(checkUserOverUnderBets())
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
    dispatch(getUserSpreadBets());
    dispatch(checkUserSpreadBets());
  }, [dispatch]);

  const handleOverChange = (option, gameID) => {
    setSelectedOptions({ ...selectedOptions, [gameID]: { over: option } });
  };

  const handleUnderChange = (option, gameID) => {
    setSelectedOptions({ ...selectedOptions, [gameID]: { under: option } });
  };

  const handleOverUnderSliderChange = (sliderOption, e) => {
    e.preventDefault()
    const newBetAmounts = { ...betAmounts, [sliderOption]: parseInt(e.target.value) };
    setBetAmounts(newBetAmounts);
  };

  const overUnderBetHandler = (gameId, selectedOption, betAmount) => {
    let status = '';

    if (selectedOption) {
      if (selectedOption.over) {
        status = 'OVER'
      } else if (selectedOption.under) {
        status = 'UNDER'
      }
    }
    const payout = (betAmount / 1.1).toFixed(2);
    dispatch(postUserOverUnderBet(gameId, status, betAmount, payout, currentWeek))
    .then(() => {
      setSelectedOptions({});
      setBetAmounts({});
      // Dispatch an action to refresh user information
      dispatch(authenticate())
      dispatch(getUserOverUnderBets());
    });
};

  if (!sessionUser) {
    return (
      <>
        <div className='ou-no-user-div'>
        <p className='ou-loading-ph'>Please log in to play a game!</p>
        <CommentListGuest />
        </div>
      </>
    );
  }

  if (!currentWeek || !allGames) {
    return <p className='ou-loading-ph'>Loading...</p>;
  }

  let games;

  if (allGames) {
    games = allGames.filter((game) => game.week == currentWeek);
  }

  return (
    <>
    <div className='ou-all-container-div'>
      <div className='ou-title-div'>
        <h2>OVER/UNDER WAGERS</h2>
        {currentWeek && <h3 className='week-title'>WEEK {currentWeek}</h3>}
      </div>
      <div className='ou-instruction-div'>
        Use your prognosticoins <img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /> (granted weekly) to place over/under bets on total game points.
        You can check your current bets on your profile.
        All bets and over/under values are locked in permanently when submitted!
      </div>
      {games && games.length && allTeams && allTeams.length ? (
        <div className='ou-all-games-div'>
          {games.map((game) => {
              const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
              const awayTeam = allTeams.find((team) => team.name === game.away_team_name);
              const overOption = `over-${game.id}`;
              const underOption = `under-${game.id}`
              const sliderOption = `slider=${game.id}`
              const currentBetAmount = betAmounts[sliderOption] || 0;
              const calculateReturnOnWin = (betAmount) => {
                return betAmount + betAmount / 1.1;
              };
            return (
              <div className={`ou-single-game-div ${game.completed ? 'completed' : (game.over_under === 0 ? 'in-progress' : '')}`} key={game.id}>
                <div className='ou-game-teams-div'>
                  <div className='ou-team-left'>
                    <img className='ou-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`} />
                    {game.away_team_name}
                  </div>
                  <div className='ou-at-between-logos'>
                    @
                  </div>
                  <div className='ou-team-right'>
                    <img className='ou-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    {game.home_team_name}
                  </div>
                </div>
                <div className='ou-game-details'>
                {game.completed ? (
                    <div className='ou-final-score'>
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
                      <div className='ou-game-spread-div' hidden={game.over_under == 0}>Spread: {game.spread === 'Game finished' ? 'Betting Closed' : game.spread}</div>
                      <div className='ou-game-over-under-div'>Over/Under: {game.over_under == 0 ? 'Betting Closed' : game.over_under}</div>
                      <div className='ou-input-overall-div' hidden={game.over_under == 0}>
                        <label>
                        <input
                            hidden={game.over_under == 0}
                            type="radio"
                            name={overOption}
                            value="over"
                            checked={selectedOptions[game.id]?.over === overOption}
                            onChange={() => handleOverChange(overOption, game.id)}
                        />
                        Over
                        </label>

                        <label>
                        <input
                            hidden={game.over_under == 0}
                            type="radio"
                            id='ou-under-radio'
                            name={underOption}
                            value="under"
                            checked={selectedOptions[game.id]?.under === underOption}
                            onChange={() => handleUnderChange(underOption, game.id)}
                        />
                        Under
                        </label>
                    </div>
                      <div hidden={game.over_under == 0} className='ou-bet-range-div'>
                        <input
                            hidden={game.over_under == 0}
                            type="range"
                            name={sliderOption}
                            min={0}
                            max={sessionUser.prognosticoins}
                            value={currentBetAmount}
                            onChange={(e) => handleOverUnderSliderChange(sliderOption, e)}
                        />
                        {currentBetAmount > 0 && (
                        <div>
                            <div className='ou-current-bet-div'>Current Bet:</div>
                            <div className='ou-bet-amount'>{currentBetAmount} <img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /></div>
                        </div>
                        )}
                        <div className='ou-return-div'>
                            {currentBetAmount > 0 && (
                                <span>Total Return on Win: {calculateReturnOnWin(currentBetAmount).toFixed(2)} <img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /></span>
                            )}
                        </div>
                        <button
                        className='ou-submit-button'
                        onClick={() => overUnderBetHandler(game.id, selectedOptions[game.id], currentBetAmount)}
                        hidden={currentBetAmount < 1 || !(selectedOptions[game.id]?.over || selectedOptions[game.id]?.under)}
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


export default OverUnderPage;
