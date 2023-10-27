import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import { getAPIGames, storeGames, storeWeek } from '../../store/games';
import { checkUserElimPicks, getUserElimPicks } from '../../store/elimPicks';
import { checkUserPickEmPicks, getUserPickEmPicks } from '../../store/pickEmPicks';
import { getUserOverUnderBets, checkUserOverUnderBets } from '../../store/overUnderBets';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import CommentListGuest from '../CommentListGuest/commentListGuest';
import './spreadEliminator.css';
import { checkUserSpreadElimPicks, deleteUserSpreadElimPick, getUserSpreadElimPicks, postUserSpreadElimPick } from '../../store/spreadElimPicks';

const SpreadEliminatorPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);
  const sessionUser = useSelector((state) => state.session.user)
  const userSpreadEliminatorPicks = useSelector(state => state.spreadEliminatorPicks.userSpreadElimPicks)

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
          dispatch()
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
    dispatch(getUserOverUnderBets())
    dispatch(checkUserOverUnderBets())
    dispatch(getUserSpreadElimPicks())
    dispatch(checkUserSpreadElimPicks())
  }, [dispatch]);

  const isTeamPickedInPreviousWeeks = (teamName, currentWeek, userSpreadEliminatorPicks) => {
    if (userSpreadEliminatorPicks && userSpreadEliminatorPicks.length < 1) return;
    for (const pick of userSpreadEliminatorPicks) {
      if (pick.week < currentWeek && pick.selected_team_name == teamName) {
        return true;
      }
    }
    return false;
  };

  const spreadElimPickHandler = (spread, over_under, teamName, gameId, week, completed, selectedTeamScore, opposingTeamScore, e) => {
    e.preventDefault()
    if (over_under == 0) {
      alert(`This game has already started! Choose another game.`)
      return;
    }
    if (isTeamPickedInPreviousWeeks(teamName, currentWeek, userSpreadEliminatorPicks)) {
      alert(`You've already picked the ${teamName} in a previous week!`);
      return;
    }
    let currWeekUserPick
    if (userSpreadEliminatorPicks && userSpreadEliminatorPicks.length > 0) {
        currWeekUserPick = userSpreadEliminatorPicks.find((pick) => pick.week === currentWeek && pick.selected_team_name === teamName);
    }
    if (currWeekUserPick && currWeekUserPick.selected_team_name === teamName) {
      dispatch(deleteUserSpreadElimPick(week))
      return;
    }
    dispatch(postUserSpreadElimPick(spread, teamName, gameId, week, completed, selectedTeamScore, opposingTeamScore))
  }

  const getTeamClassName = (game, teamName) => {
    const isPickedInPreviousWeeks = isTeamPickedInPreviousWeeks(teamName, currentWeek, userSpreadEliminatorPicks);
    let currWeekUserPick
    if (userSpreadEliminatorPicks) {
        currWeekUserPick = userSpreadEliminatorPicks.find((pick) => pick.week === currentWeek && pick.selected_team_name === teamName);
    }

    if (currWeekUserPick && currWeekUserPick.length > 0) {
      return 'current-sp-elim-pick-div';
    } else if (isPickedInPreviousWeeks) {
      return 'picked-in-previous-weeks';
    }

    return '';
  };

  if (!sessionUser) {
    return (
      <>
        <div className='sp-eliminator-no-user-div'>
        <p className='sp-eliminator-loading-ph'>Please log in to play a game!</p>
        <CommentListGuest />
        </div>
      </>
    );
  }

  if (!currentWeek || !allGames) {
    return <p className='sp-eliminator-loading-ph'>Loading...</p>;
  }

  let games;

  if (allGames) {
    games = allGames.filter((game) => game.week == currentWeek);
  }

  return (
    <>
    <div className='sp-eliminator-all-container-div'>
      <div className='sp-eliminator-title-div'>
        <h2>SPREAD ELIMINATOR</h2>
        {currentWeek && <h3 className='week-title'>WEEK {currentWeek}</h3>}
      </div>
      <div className='sp-eliminator-instruction-div'>
        Select a team each week who you believe will beat the spread.
        You may only select a team once per season, and teams in games which have already started (bordered in red) may not be selected.
        The user with the best overall record at the end of the season will be the winner!
      </div>
      {games && games.length && allTeams && allTeams.length ? (
        <div className='sp-eliminator-all-games-div'>
          {games.map((game) => {
              const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
              const awayTeam = allTeams.find((team) => team.name === game.away_team_name);

            return (
              <div className={`sp-eliminator-single-game-div ${game.completed ? 'completed' : (game.over_under === 0 ? 'in-progress' : '')}`} key={game.id}>
                <div className='sp-eliminator-game-teams-div'>
                  <div onClick={(e) => spreadElimPickHandler(game.spread, game.over_under, awayTeam.name, game.id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)}
                  className={`sp-eliminator-team-left ${getTeamClassName(game, awayTeam.name)}`}
                  >
                    <img className='sp-eliminator-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`} />
                    {game.away_team_name}
                  </div>
                  <div className='sp-eliminator-at-between-logos'>
                    @
                  </div>
                  <div onClick={(e) => spreadElimPickHandler(game.spread, game.over_under, homeTeam.name, game.id, currentWeek, game.completed, game.away_team_score, game.home_team_score, e)}
                  className={`sp-eliminator-team-right ${getTeamClassName(game, homeTeam.name)}`}
                  >
                    <img className='sp-eliminator-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    {game.home_team_name}
                  </div>
                </div>
                <div className='sp-eliminator-game-details'>
                {game.completed ? (
                    <div className='sp-eliminator-final-score'>
                      Final: {game.away_team_score} - {game.home_team_score}
                      <br />
                      {game.away_team_score > game.home_team_score
                        ? `${game.away_team_name} victory`
                        : `${game.home_team_name} victory`}
                    </div>
                  ) : (
                    <div className='sp-eliminator-current-score'>
                      Current: {game.home_team_score} - {game.away_team_score}
                    </div>
                  )}
                  {!game.completed && (
                    <>
                      <div className='sp-eliminator-game-spread-div'>
                        Spread: {game.spread === 'Game finished' ? 'Betting Closed' : game.spread}
                      </div>
                      <div className='sp-eliminator-game-over-under-div'>Over/Under: {game.over_under == 0 ? 'Betting Closed' : game.over_under}</div>
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

export default SpreadEliminatorPage;
