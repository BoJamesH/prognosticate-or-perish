import { useSelector, useDispatch } from 'react-redux';
import { getUserElimPicks, checkUserElimPicks } from '../../store/elimPicks';
import { useEffect } from 'react';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import './userPage.css'


const UserPage = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.session.user);
    const eliminatorPicks = useSelector((state) => state.eliminatorPicks.userElimPicks);

    useEffect(() => {
        dispatch(getUserElimPicks())
        dispatch(checkUserElimPicks());
    }, [dispatch]);

    if (!eliminatorPicks || !user) {
        return <p>Loading . . .</p>
    }

    return (
    <div className="user-profile-page">
        <h1>User Profile</h1>
        <div className="user-details">
        <div className="user-avatar">
            <img className='user-page-profile-img' src={user.profile_image} alt={`${user.username}'s Profile`} />
        </div>
        <div className="user-info">
            <h2>{user.username}</h2>
            <p>Email: {user.email}</p>
        </div>
        </div>
        <h2>Eliminator Picks</h2>
        <div className='eliminator-record'>
            Eliminator record: {user.elim_wins} - {user.elim_losses} - {user.elim_ties}
        </div>
        <div className="eliminator-picks">
        {eliminatorPicks.map((pick) => (
            <div key={pick.id} className="eliminator-pick">
            <p>Week {pick.week}</p>
            <p>Selected Team: {pick.selected_team_name}</p>
            <p>Status: {pick.status}</p>
            </div>
        ))}
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
