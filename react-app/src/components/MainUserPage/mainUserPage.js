import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getComments } from '../../store/comments'
import './mainUserPage.css'
import { getGames, getWeek } from '../../store/games'

const MainUserPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const comments = useSelector(state => state.comments.allComments)
    const games = useSelector(state => state.games.allGames)
    const currentWeek = useSelector(state => state.games.currentWeek)
    console.log('CURRENTWEEK------------- ', currentWeek)
    useEffect( async () => {
        await dispatch(getWeek())
        await dispatch(getComments())
        await dispatch(getGames(currentWeek))
    }, [dispatch])

    console.log(games)
    return(
        <>
        <h1>MAIN USER PAGE</h1>
        {comments.length ?
        <div className='all-comments-div'>
            {comments.map(comment => {
                return (
                    <div key={comment.id} className='each-comment-div'>
                        {comment.user_username}: {comment.comment_text}
                    </div>
                )
            })}
        </div> : null}
        </>
    )
}


export default MainUserPage

// {channels.length ?
//     <div className='channels'>
//         {channels.map(channel => {
//             if (!channel.id) return null
//             return (
//                 <div key={channel.id} className='channel'>
//                     {/* <Link to="/" */}
//                     <ChannelUtils channel={channel} server={server}/>
//                 </div>
//             )
//         })}
//     </div>: null}
