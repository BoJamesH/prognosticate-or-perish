import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getComments } from '../../store/comments';
import './commentList.css';


const CommentList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.allComments);

  useEffect(() => {
    dispatch(getComments());
  }, [dispatch]);


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
