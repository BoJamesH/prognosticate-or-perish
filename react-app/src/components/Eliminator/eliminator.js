import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import { getAPIGames, storeGames, storeWeek } from '../../store/games';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import './eliminator.css';

const EliminatorPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);
  // const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const lastGamesFetchTimestamp = localStorage.getItem('lastGamesFetchTimestamp');
    const currentTime = Date.now();
    const fetchGamesAndWeek = async () => {
      try {
        localStorage.setItem('lastGamesFetchTimestamp', String(currentTime));
          dispatch(getAPIGames());
          // dispatch(getAPIWeek());
          dispatch(storeGames());
          dispatch(storeWeek());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (
      !lastGamesFetchTimestamp || currentTime - Number(lastGamesFetchTimestamp) > 30 * 60 * 1000) {
      fetchGamesAndWeek();
    }
    // Fetch non-API backend data
    // dispatch(getAPIGames());
    dispatch(getTeams());
    dispatch(getComments());
    dispatch(storeWeek());
    dispatch(storeGames());

  }, [dispatch]);

  const elimPickHandler = (teamName, gameIdESPN, week, completed, e) => {
    e.preventDefault()
    if (completed) {
      alert('You cannot pick a completed game in eliminator!')
    }
    dispatch(createElimPick(teamName, gameIdESPN, week, completed))
}



  if (!currentWeek || !allGames) {
    return <p>Loading...</p>;
  }

  let games;

  if (allGames) {
    games = allGames.filter((game) => game.week == currentWeek);
  }

  return (
    <>
    <div className='eliminator-all-container-div'>
      <div className='eliminator-title-div'>
        {currentWeek && <h3>WEEK {currentWeek} ELIMINATOR</h3>}
      </div>
      {games && games.length && allTeams && allTeams.length ? (
        <div className='eliminator-all-games-div'>
          {games.map((game) => {
              const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
              const awayTeam = allTeams.find((team) => team.name === game.away_team_name);

            return (
              <div className={`eliminator-single-game-div ${game.completed ? 'completed' : ''}`} key={game.id}>
                <div className='eliminator-game-teams-div'>
                  <div onClick={(e) => elimPickHandler(awayTeam.name, game.espn_id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)} className='eliminator-team-left'>
                    <img className='eliminator-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`} />
                    {game.away_team_name}
                  </div>
                  <div className='eliminator-at-between-logos'>
                    @
                  </div>
                  <div className='eliminator-team-right'>
                    <img className='eliminator-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    {game.home_team_name}
                  </div>
                </div>
                <div className='eliminator-game-details'>
                  {game.completed ? (
                    <div className='eliminator-final-score'>Final: {game.home_team_score} - {game.away_team_score}</div>
                  ) : (
                    <div className='eliminator-current-score'>Current: {game.home_team_score} - {game.away_team_score}</div>
                  )}
                  {!game.completed && (
                    <>
                      <div className='eliminator-game-spread-div'>Spread: {game.spread}</div>
                      <div className='eliminator-game-over-under-div'>Over/Under: {game.over_under}</div>
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

            <div className='main-commentform-div'>
            <CommentForm />
            </div>
            <div className='main-commentlist-div'>
              <CommentList />
            </div>
      </div>
    </>
  );
};

export default EliminatorPage;
