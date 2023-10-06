import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getComments } from '../../store/comments';
import { getTeams } from '../../store/teams';
import './mainUserPage.css';
import { getAPIGames, getAPIWeek, storeGames, storeWeek } from '../../store/games';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';

const MainUserPage = () => {
  const dispatch = useDispatch();
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const allGames = useSelector((state) => state.games.allGames);
  const allTeams = useSelector((state) => state.teams.allTeams);

  useEffect(() => {

    const lastGamesFetchTimestamp = localStorage.getItem('lastGamesFetchTimestamp');
    const lastWeekFetchTimestamp = localStorage.getItem('lastWeekFetchTimestamp');
    const currentTime = Date.now();


    const fetchGamesAndWeek = async () => {
      try {
        localStorage.setItem('lastGamesFetchTimestamp', String(currentTime));
        localStorage.setItem('lastWeekFetchTimestamp', String(currentTime));
          dispatch(getAPIGames());
          dispatch(getAPIWeek());
          dispatch(storeGames());
          dispatch(storeWeek());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (
      !lastGamesFetchTimestamp ||
      !lastWeekFetchTimestamp ||
      currentTime - Number(lastGamesFetchTimestamp) > 24 * 60 * 60 * 1000 ||
      currentTime - Number(lastWeekFetchTimestamp) > 24 * 60 * 60 * 1000
    ) {
      fetchGamesAndWeek();
    }

    // Fetch non-API backend data
    dispatch(getTeams());
    dispatch(getComments());
    dispatch(storeWeek());
    dispatch(storeGames());

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
