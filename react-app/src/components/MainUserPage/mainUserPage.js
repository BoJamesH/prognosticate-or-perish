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
    // Check if a day has passed since the last fetch of games and week
    const lastGamesFetchTimestamp = localStorage.getItem('lastGamesFetchTimestamp');
    const lastWeekFetchTimestamp = localStorage.getItem('lastWeekFetchTimestamp');
    const currentTime = Date.now();

    // Define a function to fetch games and week
    const fetchGamesAndWeek = async () => {
      try {
        // Fetch games
        const gamesResponse = await fetch('/api/games');
        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json();
          dispatch(storeGames(gamesData)); // Update the Redux store with games
          localStorage.setItem('lastGamesFetchTimestamp', String(currentTime));

          // Trigger the API call to get games if a day has passed
          dispatch(getAPIGames());
        }

        // Fetch week
        const weekResponse = await fetch('/api/week');
        if (weekResponse.ok) {
          const weekData = await weekResponse.json();
          const currentWeekFromBackend = Number(weekData.week);
          dispatch(storeWeek(currentWeekFromBackend)); // Update the Redux store with the current week
          localStorage.setItem('lastWeekFetchTimestamp', String(currentTime));

          // Trigger the API call to get the week if a day has passed
          dispatch(getAPIWeek());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Check if a day has passed for both games and week fetches
    if (
      !lastGamesFetchTimestamp ||
      !lastWeekFetchTimestamp ||
      currentTime - Number(lastGamesFetchTimestamp) > 24 * 60 * 60 * 1000 ||
      currentTime - Number(lastWeekFetchTimestamp) > 24 * 60 * 60 * 1000
    ) {
      fetchGamesAndWeek(); // Fetch games and week if necessary
    }

    // Fetch other data
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
