import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { deleteComment, getComments } from '../../store/comments';
import './commentList.css';


const CommentList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const comments = useSelector(state => state.comments.allComments);
    const sessionUserId = useSelector(state => state.session.user.id)

    useEffect(() => {
        dispatch(getComments());
    }, [dispatch]);

    // const updateMessageHandler = async (messageId, message_text, e) => {
    //     e.preventDefault()
    //     setEditMessageId(messageId)
    //     setEditMessage(true)
    //     setEditMessageText(message_text)
    // }

    // const submitEditCommentHandler = async(messageId, message_text, e) => {
    //     e.preventDefault()
    //     dispatch(updateMessage(serverId, channelId, messageId, message_text))
    //     setEditMessage(false)
    // }

    const deleteCommentHandler = (commentId, e) => {
        e.preventDefault()
        dispatch(deleteComment(commentId))
    }

    const updateMessageHandler = (commentId, commentText, e) => {
        e.preventDefault()
    }

    return (
        <>
            {comments.length ? (
            <div className='all-comments-div'>
                {comments.map((comment) => {
                return (
                    <div key={comment.id} className='each-comment-div'>
                    <div className='comment-img-username'>
                    <div className='comment-username-div'>{comment.user_username}</div>
                    <div className='comment-img-div'>
                    <img className='comment-profile-img' src={comment.user_profile_image} alt='User profile image' />
                    </div>
                    </div>
                    <div className='comment-text-div'>{comment.comment_text}</div>
                    <div className='comment-edit-delete-div'>
                        <button className='comment-edit-button' hidden={sessionUserId !== comment.user_id} onClick={(e) => updateMessageHandler(comment.id, comment.comment_text, e)}>Edit</button>
                        <button className='comment-delete-button' hidden={sessionUserId !== comment.user_id} onClick={(e) => deleteCommentHandler(comment.id, e)}>Delete</button>
                    </div>
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

export default CommentList;
