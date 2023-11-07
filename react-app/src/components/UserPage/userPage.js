import { useSelector, useDispatch } from 'react-redux';
import { getUserElimPicks, checkUserElimPicks } from '../../store/elimPicks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import CommentListGuest from '../CommentListGuest/commentListGuest';
import { changeProfileImg } from '../../store/session';
import { checkUserPickEmPicks, getUserPickEmPicks } from '../../store/pickEmPicks';
import './userPage.css'
import { checkUserOverUnderBets, getUserOverUnderBets } from '../../store/overUnderBets';
import { storeGames, storeWeek } from '../../store/games';
import { checkUserSpreadElimPicks, getUserSpreadElimPicks } from '../../store/spreadElimPicks';
import { checkUserSpreadBets, getUserSpreadBets } from '../../store/spreadBets';


const UserPage = () => {
  const dispatch = useDispatch()
  const currentWeek = Number(useSelector((state) => state.games.currentWeek));
  const user = useSelector((state) => state.session.user);
  const eliminatorPicks = useSelector((state) => state.eliminatorPicks.userElimPicks);
  const spreadElimPicks = useSelector((state) => state.spreadEliminatorPicks.userSpreadElimPicks)
  const userOverUnderBets = useSelector(state => state.overUnderBets.userOverUnderBets)
  const userSpreadBets = useSelector(state => state.spreadBets.userSpreadBets)
  const currWeekGames = useSelector(state => state.games.allGames)
  const currentWeekUserBets = userOverUnderBets.filter((bet) => bet.week === currentWeek);
  const currentWeekUserSpreadBets = userSpreadBets.filter((bet) => bet.week === currentWeek);
  const [showChangeProfile, setShowChangeProfile] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState('');

  useEffect(() => {
      dispatch(storeWeek())
      dispatch(storeGames())
      dispatch(getUserElimPicks())
      dispatch(checkUserElimPicks())
      dispatch(getUserPickEmPicks())
      dispatch(checkUserPickEmPicks())
      dispatch(getUserOverUnderBets())
      dispatch(checkUserOverUnderBets())
      dispatch(getUserSpreadElimPicks())
      dispatch(checkUserSpreadElimPicks())
      dispatch(getUserSpreadBets())
      dispatch(checkUserSpreadBets())
  }, [dispatch]);

  const changeProfilePicHandler = (profile_image, e) => {
        e.preventDefault();
        dispatch(changeProfileImg(profile_image))
        setShowChangeProfile(false)
  };

  const calculateTotalOverUnderPayout = (allUserOUBets) => {
    const totalPayout = allUserOUBets.reduce((accumulator, bet) => {
      return accumulator + bet.payout;
    }, 0);

    return totalPayout;
  }

  const calculateTotalSpreadPayout = (allUserSpreadBets) => {
    const totalWagered = allUserSpreadBets.reduce((accumulator, bet) => {
      return accumulator + bet.progs_wagered;
    }, 0);

    const totalPayout = totalWagered / 1.1;

    return totalPayout;
  }

  if (!user) {
      return (
        <div className="no-profile-no-user-div">
          <p className='user-page-ph'>Please log in to view the user page . . .</p>
          <CommentListGuest />
        </div>
      );
  }

  return (
  <div className="user-profile-page">
      <h1>User Profile</h1>
      <div className="user-details">
      <div className="user-avatar">
          <img className='user-page-profile-img' src={user.profile_image} alt={`${user.username}'s Profile`} />
      </div>
      {showChangeProfile ? (
        <div className="change-profile">
          <input type="url"
          className='user-profile-img-change-field'
          value={newProfileImage} placeholder="New Profile Image URL"
          onChange={(e) => setNewProfileImage(e.target.value)} />
          <div>
          <button className="submit-profile-button" onClick={() => setShowChangeProfile(false)}>Cancel</button>
          <button className="submit-profile-button" onClick={(e) => changeProfilePicHandler(newProfileImage, e)}>Submit</button>
          </div>
        </div>
      ) : (
        <button className="user-change-profile-img" onClick={() => setShowChangeProfile(true)}>Change Profile Image</button>
      )}
      <div className="user-info">
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>
          <p>Prognosticoins: {user.prognosticoins.toFixed(2)}<img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /> </p>
      </div>
      </div>
      <div className='user-games-div'>
      <div className='user-elim-record'>
      <h3><Link className='user-elim-link' to='/eliminator'>Eliminator</Link></h3>
          <h4>Eliminator record: {user.elim_wins} - {user.elim_losses} - {user.elim_ties}</h4>
          {eliminatorPicks && eliminatorPicks.map((pick) => (
          <div key={pick.id} className="eliminator-pick">
          <p>Week {pick.week}</p>
          <p>Selected Team: {pick.selected_team_name}</p>
          <p>Status: {pick.status}</p>
          </div>
      ))}
      </div>
      <span className='user-pickem-record'>
          <h3><Link className='user-elim-link' to='/pickem'>Pick 'Em</Link></h3>
          <div className='eliminator-record'>
          <h4>Pick 'em record: {user.pick_wins} - {user.pick_losses} - {user.pick_ties}</h4>
          </div>
      </span>
      <span className='user-pickem-record'>
          <h3><Link className='user-elim-link' to='/pickem'>Spread Eliminator</Link></h3>
          <div className='eliminator-record'>
          <h4>Spread Eliminator record: {user.sp_elim_wins} - {user.sp_elim_losses} - {user.sp_elim_pushes}</h4>
          {spreadElimPicks && spreadElimPicks.map((pick) => (
          <div key={pick.id} className="eliminator-pick">
          <p>Week {pick.week}</p>
          <p>Selected Team: {pick.selected_team_name}</p>
          <p>Spread: {pick.spread}</p>
          <p>Status: {pick.status}</p>
          </div>
      ))}
          </div>
      </span>
      <span className='user-over-under-bets'>
      <div className="user-over-under-bets">
      <h3><Link className="user-elim-link" to="/overunder">Over/Under Wagers</Link></h3>
      <div className="eliminator-record">
          <h4 className='user-record-subtitle'>Week {currentWeek} Over/Under Bets:</h4>
          <p>Total Potential Payout: {calculateTotalOverUnderPayout(currentWeekUserBets).toFixed(2)} <img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /></p>
          {currentWeekUserBets.length === 0 ? (
              <p>No bets placed for the current week.</p>
          ) : (
              <div>
                  {currentWeekUserBets.map((bet) => {
                      const game = currWeekGames.find((game) => game.id === bet.game_id);
                      if (!game) {
                          return null;
                      }

                      return (
                          <div className='user-ou-bet-game' key={bet.id}>
                              <div>Game: {game.away_team_name} vs {game.home_team_name}</div>
                              <div>Over/Under: {game.over_under === 0 ? 'Betting Closed' : game.over_under}</div>
                              <div>Amount Wagered: {bet.progs_wagered}<img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /> Prognosticoins </div>
                              <div>Bet: {bet.status}</div>
                          </div>
                      );
                  })}
              </div>
            )}
            </div>
        </div>
        </span>
          <span className='user-over-under-bets'>
            <div className="user-spread-bets">
            <h3><Link className="user-elim-link" to="/overunder">Spread Wagers</Link></h3>
            <div className="spread-record">
                <h4 className='user-record-subtitle'>Week {currentWeek} Spread Bets:</h4>
                <p>Total Potential Payout: {calculateTotalSpreadPayout(currentWeekUserSpreadBets).toFixed(2)} <img className='coin-img' src='https://i.imgur.com/IBtKgXx.png' alt='Coin Icon' /></p>
                {currentWeekUserSpreadBets.length === 0 ? (
                    <p>No bets placed for the current week.</p>
                ) : (
                    <div>
                        {currentWeekUserSpreadBets.map((bet) => {
                            const game = currWeekGames.find((game) => game.id === bet.game_id);
                            if (!game) {
                                return null;
                            }

                            return (
                                <div className='user-ou-bet-game' key={bet.id}>
                                    <div>Game: {game.away_team_name} vs {game.home_team_name}</div>
                                    <div>Spread: {game.over_under === 0 ? 'Betting Closed' : bet.spread_at_bet}</div>
                                    <div>Selected Team: {bet.selected_team_name}</div>
                                    <div>Amount Wagered: {bet.progs_wagered} Prognosticoins</div>
                                    <div>Bet: {bet.status}</div>
                                </div>
                            );
                        })}
                    </div>
                  )}
                  </div>
              </div>
          </span>
        </div>
        {user && (
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
  );
};

export default UserPage;
