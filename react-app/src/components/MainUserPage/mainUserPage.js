import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import './mainUserPage.css';
import { getGames, getWeek, storeGames } from '../../store/games';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';

const MainUserPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.allComments);
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams)

  useEffect(() => {
    dispatch(getTeams());
    dispatch(getComments());
    dispatch(storeGames());
    dispatch(getWeek());
  }, [dispatch]);

  if (!currentWeek || !allGames) {
    return <p>Loading...</p>;
  }

  const games = allGames.filter((game) => game.week == currentWeek);

  return (
    <>
    <div className='main-page-all-container-div'>
      <div className='main-page-title-div'>
        <h1>MAIN USER PAGE</h1>
        {currentWeek && <h3>WEEK {currentWeek} GAMES</h3>}
      </div>
        {games.length ? (
            <div className='main-page-all-games-div'>
                {games.map((game) => {
                const homeTeam = allTeams.find((team) => team.name === game.home_team_name);
                const awayTeam = allTeams.find((team) => team.name === game.away_team_name);

                return (
                    <div className='main-page-single-game-div' key={game.id}>
                    <div className='main-page-game-teams-div'>
                        <img className='main-page-team-logo' src={awayTeam.logo_small} alt={`${awayTeam.name} logo`}  />
                        {game.away_team_name} AT {game.home_team_name}
                        <img className='main-page-team-logo' src={homeTeam.logo_small} alt={`${homeTeam.name} logo`} />
                    </div>
                    <div className='main-page-game-spread-div'>SPREAD: {game.spread}</div>
                    <div className='main-page-game-over-under-div'>OVER/UNDER: {game.over_under}</div>
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

export default MainUserPage;
