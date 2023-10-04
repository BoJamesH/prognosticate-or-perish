import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import './mainUserPage.css';
import { getGames, getWeek } from '../../store/games';

const MainUserPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.allComments);
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams)

  useEffect(() => {
    dispatch(getComments());
    dispatch(getGames());
    dispatch(getTeams())
    dispatch(getWeek());
  }, [dispatch]);

  // Conditional rendering
  if (!currentWeek || !allGames) {
    // Loading indicator or empty state
    return <p>Loading...</p>;
  }

  const games = allGames.filter((game) => game.week == currentWeek);

  return (
    <>
      <div>
        <h1>MAIN USER PAGE</h1>
        {currentWeek && <h3>WEEK {currentWeek} GAMES</h3>}
      </div>
        {games.length ? (
            <div className='all-games-div'>
                {games.map((game) => {
                const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
                const awayTeam = allTeams.find((team) => team.name === game.away_team_name);

                return (
                    <div className='single-game-div' key={game.id}>
                    <div className='game-teams-div'>
                        <img src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                        {game.away_team_name} AT {game.home_team_name}
                        <img src={awayTeam.logo_small} alt={`${awayTeam.name} logo`}  />
                    </div>
                    <div className='game-spread-div'>SPREAD: {game.spread}</div>
                    <div className='game-spread-div'>OVER/UNDER: {game.over_under}</div>
                    </div>
                );
                })}
            </div>
            ) : (
            <p>No games available for the current week.</p>
            )}
      {comments.length ? (
        <div className='all-comments-div'>
          {comments.map((comment) => {
            return (
              <div key={comment.id} className='each-comment-div'>
                {comment.user_username}: {comment.comment_text}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No comments available.</p>
      )}
    </>
  );
};

export default MainUserPage;
