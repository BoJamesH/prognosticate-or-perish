import { useSelector, useDispatch } from 'react-redux';
import { getUserElimPicks, checkUserElimPicks } from '../../store/elimPicks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import { changeProfileImg } from '../../store/session';
import { checkUserPickEmPicks, getUserPickEmPicks } from '../../store/pickEmPicks';
import './userPage.css'


const UserPage = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.session.user);
    const eliminatorPicks = useSelector((state) => state.eliminatorPicks.userElimPicks);
    const pickEmPicks = useSelector((state) => state.pickEmPicks.userPickEmPicks)
    const [showChangeProfile, setShowChangeProfile] = useState(false);
    const [newProfileImage, setNewProfileImage] = useState('');

    useEffect(() => {
        dispatch(getUserElimPicks())
        dispatch(checkUserElimPicks());
        dispatch(getUserPickEmPicks())
        dispatch(checkUserPickEmPicks())
    }, [dispatch]);

    const changeProfilePicHandler = (profile_image, e) => {
        e.preventDefault();
        dispatch(changeProfileImg(profile_image))
        setShowChangeProfile(false)
      };

    if (!user) {
        return <p>Please log in to view the user page . . .</p>
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
        </div>
        </div>
        <div className='user-games-div'>
        <div className='user-elim-record'>
        <h3><Link className='user-elim-link' to='/eliminator'>Eliminator</Link></h3>
            Eliminator record: {user.elim_wins} - {user.elim_losses} - {user.elim_ties}
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
            Pick 'em record: {user.pick_wins} - {user.pick_losses} - {user.pick_ties}
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
