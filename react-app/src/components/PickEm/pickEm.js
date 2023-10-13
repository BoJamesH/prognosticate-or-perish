import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import { getAPIGames, storeGames, storeWeek } from '../../store/games';
import { getUserPickEmPicks, postUserPickEmPick, deleteUserPickEmPick, checkUserPickEmPicks } from '../../store/pickEmPicks';
import { getUserElimPicks, checkUserElimPicks } from '../../store/elimPicks';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import './pickEm.css';

const PickEmPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);
  const sessionUser = useSelector((state) => state.session.user)
  const userPickEmPicks = useSelector(state => state.pickEmPicks.userPickEmPicks)


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
          dispatch(checkUserPickEmPicks())
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
    dispatch(checkUserPickEmPicks)
  }, [dispatch]);

  const getTeamClassName = (game, teamName) => {
    const currWeekUserPickEmPicks = userPickEmPicks.filter((pick) => pick.week === currentWeek && pick.selected_team_name === teamName);

    if (currWeekUserPickEmPicks.length > 0) {
      const className = 'current-pickem-pick-div';
      return className;
    } else {
      return '';
    }
  };


  const pickEmPickHandler = (teamName, gameId, week, completed, selectedTeamScore, opposingTeamScore, e) => {
    e.preventDefault();
    const existingPick = userPickEmPicks.find(
      (pick) => pick.week === week && pick.selected_team_name === teamName
    );

    if (existingPick) {
      // If a pick for the same week and team already exists, delete it
      dispatch(deleteUserPickEmPick(existingPick.game_id));
    } else if (completed) {
      alert(`This game has already started! Choose another game.`);
    } else {
      dispatch(postUserPickEmPick(teamName, gameId, week, completed, selectedTeamScore, opposingTeamScore));
    }
  };

  if (!sessionUser) {
    return <p className='pickem-loading-ph'>Please log in to play a game!</p>
  }

  if (!currentWeek || !allGames) {
    return <p className='pickem-loading-ph'>Loading...</p>;
  }

  let games;

  if (allGames) {
    games = allGames.filter((game) => game.week == currentWeek);
  }

  return (
    <>
    <div className='pickem-all-container-div'>
      <div className='pickem-title-div'>
        <h2>PICK 'EM</h2>
        {currentWeek && <h3 className='week-title'>WEEK {currentWeek}</h3>}
      </div>
      <div className='pickem-instruction-div'>
        Choose the winner of every game, without taking the spread into account.
        The user with the best overall record at the end of the season will be the winner!
      </div>
      {games && games.length && allTeams && allTeams.length ? (
        <div className='pickem-all-games-div'>
          {games.map((game) => {
              const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
              const awayTeam = allTeams.find((team) => team.name === game.away_team_name);

            return (
              <div className={`pickem-single-game-div ${game.completed ? 'completed' : ''}`} key={game.id}>
                <div className='pickem-game-teams-div'>
                  <div onClick={(e) => pickEmPickHandler(awayTeam.name, game.id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)}
                  className={`pickem-team-left ${getTeamClassName(game, awayTeam.name)}`}
                  >
                    <img className='pickem-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`} />
                    {game.away_team_name}
                  </div>
                  <div className='pickem-at-between-logos'>
                    @
                  </div>
                  <div onClick={(e) => pickEmPickHandler(homeTeam.name, game.id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)}
                  className={`pickem-team-right ${getTeamClassName(game, homeTeam.name)}`}
                  >
                    <img className='pickem-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    {game.home_team_name}
                  </div>
                </div>
                <div className='pickem-game-details'>
                {game.completed ? (
                    <div className='pickem-final-score'>
                      Final: {game.away_team_score} - {game.home_team_score}
                      <br />
                      {game.away_team_score > game.home_team_score
                        ? `${game.away_team_name} victory`
                        : `${game.home_team_name} victory`}
                    </div>
                  ) : (
                    <div className='pickem-current-score'>
                      Current: {game.home_team_score} - {game.away_team_score}
                    </div>
                  )}
                  {!game.completed && (
                    <>
                      <div className='pickem-game-spread-div'>Spread: {game.spread}</div>
                      <div className='pickem-game-over-under-div'>Over/Under: {game.over_under}</div>
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

export default PickEmPage;
