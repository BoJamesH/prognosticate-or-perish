import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../store/allUsers';
import Leaderboard from './singleLeaderboard';
import './leaderboards.css'
import { checkUserElimPicks } from '../../store/elimPicks';
import { checkUserPickEmPicks } from '../../store/pickEmPicks';
import PrognosticoinLeaderboard from './progLeaderboard';
import EliminatorLeaderboard from './elimLeaderboard';
import PickEmLeaderboard from './pickEmLeaderboard';

function LeaderboardPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const allUsers = useSelector(state => state.allUsers.allUsers)

    useEffect(() => {
        dispatch(getAllUsers())
        dispatch(checkUserElimPicks())
        dispatch(checkUserPickEmPicks())
    }, [dispatch])

    return (
        <>
        {allUsers &&
                <div className="leaderboard-page">
                <EliminatorLeaderboard users={allUsers} />
                <PickEmLeaderboard users={allUsers} />
                <PrognosticoinLeaderboard users={allUsers} />
              </div>
        }
        <div className='leaderboard-all-comments-div'>
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

}

export default LeaderboardPage;
