import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import { getAPIGames, storeGames, storeWeek } from '../../store/games';
import { checkUserElimPicks, deleteUserElimPick, getUserElimPicks, postUserElimPick } from '../../store/elimPicks';
import { checkUserPickEmPicks, getUserPickEmPicks } from '../../store/pickEmPicks';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import './eliminator.css';

const EliminatorPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);
  const sessionUser = useSelector((state) => state.session.user)
  const userEliminatorPicks = useSelector(state => state.eliminatorPicks.userElimPicks)

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
    dispatch(getUserPickEmPicks());
    dispatch(checkUserPickEmPicks());
  }, [dispatch]);

  const isTeamPickedInPreviousWeeks = (teamName, currentWeek, userEliminatorPicks) => {
    for (const pick of userEliminatorPicks) {
      if (pick.week < currentWeek && pick.selected_team_name == teamName) {
        return true;
      }
    }
    return false;
  };

  const elimPickHandler = (teamName, gameId, week, completed, selectedTeamScore, opposingTeamScore, e) => {
    e.preventDefault()
    if (completed) {
      alert(`This game has already started! Choose another game.`)
      return;
    }
    if (isTeamPickedInPreviousWeeks(teamName, currentWeek, userEliminatorPicks)) {
      alert(`You've already picked the ${teamName} in a previous week!`);
      return;
    }
    const currWeekUserPick = userEliminatorPicks.find((pick) => pick.week === currentWeek && pick.selected_team_name === teamName);
    if (currWeekUserPick && currWeekUserPick.selected_team_name === teamName) {
      dispatch(deleteUserElimPick(week))
      return;
    }
    dispatch(postUserElimPick(teamName, gameId, week, completed, selectedTeamScore, opposingTeamScore))
  }

  const getTeamClassName = (game, teamName) => {
    const isPickedInPreviousWeeks = isTeamPickedInPreviousWeeks(teamName, currentWeek, userEliminatorPicks);
    const currWeekUserPick = userEliminatorPicks.find((pick) => pick.week === currentWeek && pick.selected_team_name === teamName);

    if (currWeekUserPick) {
      return 'current-elim-pick-div';
    } else if (isPickedInPreviousWeeks) {
      return 'picked-in-previous-weeks';
    }

    return '';
  };

  if (!sessionUser) {
    return <p className='eliminator-loading-ph'>Please log in to play a game!</p>
  }

  if (!currentWeek || !allGames) {
    return <p className='eliminator-loading-ph'>Loading...</p>;
  }

  let games;

  if (allGames) {
    games = allGames.filter((game) => game.week == currentWeek);
  }

  return (
    <>
    <div className='eliminator-all-container-div'>
      <div className='eliminator-title-div'>
        <h2>ELIMINATOR</h2>
        {currentWeek && <h3 className='week-title'>WEEK {currentWeek}</h3>}
      </div>
      <div className='eliminator-instruction-div'>
        Select a team each week who you believe will win their game.
        You may only select a team once per season, and teams in games which have already started (bordered in red) may not be selected.
        The user with the best overall record at the end of the season will be the winner!
      </div>
      {games && games.length && allTeams && allTeams.length ? (
        <div className='eliminator-all-games-div'>
          {games.map((game) => {
              const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
              const awayTeam = allTeams.find((team) => team.name === game.away_team_name);

            return (
              <div className={`eliminator-single-game-div ${game.completed ? 'completed' : ''}`} key={game.id}>
                <div className='eliminator-game-teams-div'>
                  <div onClick={(e) => elimPickHandler(awayTeam.name, game.id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)}
                  className={`eliminator-team-left ${getTeamClassName(game, awayTeam.name)}`}
                  >
                    <img className='eliminator-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`} />
                    {game.away_team_name}
                  </div>
                  <div className='eliminator-at-between-logos'>
                    @
                  </div>
                  <div onClick={(e) => elimPickHandler(homeTeam.name, game.id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)}
                  className={`eliminator-team-right ${getTeamClassName(game, homeTeam.name)}`}
                  >
                    <img className='eliminator-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    {game.home_team_name}
                  </div>
                </div>
                <div className='eliminator-game-details'>
                {game.completed ? (
                    <div className='eliminator-final-score'>
                      Final: {game.away_team_score} - {game.home_team_score}
                      <br />
                      {game.away_team_score > game.home_team_score
                        ? `${game.away_team_name} victory`
                        : `${game.home_team_name} victory`}
                    </div>
                  ) : (
                    <div className='eliminator-current-score'>
                      Current: {game.home_team_score} - {game.away_team_score}
                    </div>
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

export default EliminatorPage;
