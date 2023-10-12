import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteComment, getComments, updateComment } from '../../store/comments';
import './commentList.css';


const CommentList = () => {
    const dispatch = useDispatch();
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const comments = useSelector(state => state.comments.allComments);
    const sessionUserId = useSelector(state => state.session.user.id)
    const [editComment, setEditComment ] = useState(false)
    const [editCommentText, setEditCommentText] = useState("")
    const [editCommentId, setEditCommentId] = useState(null)

    useEffect(() => {
        dispatch(getComments());
    }, [dispatch]);

    const deleteCommentHandler = (commentId, e) => {
        e.preventDefault()
        dispatch(deleteComment(commentId))
    }

    const updateCommentHandler = async (commentId, comment_text, e) => {
        e.preventDefault()
        setEditCommentId(commentId)
        setEditComment(true)
        setEditCommentText(comment_text)
    }

    const submitUpdatedComment = async (commentId, comment_text, e) => {
      e.preventDefault();
      const trimmedCommentText = comment_text.trim();

      if (trimmedCommentText.length > 4000) {
        alert('Please limit comments to less than 4,000 characters.');
        return;
      }
      if (trimmedCommentText.length < 1) {
        alert('Comments must have something in them!');
        return;
      }
      setEditComment(false);
      dispatch(updateComment(commentId, trimmedCommentText));
      dispatch(getComments());
    };

    function formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;

      if (isSameDay(date, now)) {
        return `Today at ${formatTime(date)}`;
      } else if (isYesterday(date, now)) {
        return `Yesterday at ${formatTime(date)}`;
      } else {
        return `${formatFullDate(date)}`;
      }
    }

    function isSameDay(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    }

    function isYesterday(date, now) {
      const yesterday = new Date(now - oneDay);
      return isSameDay(date, yesterday);
    }

    function formatFullDate(date) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const ampm = hour >= 12 ? 'PM' : 'AM';

      return `${month} ${day}, ${formatHour(hour)}:${formatMinute(minute)} ${ampm}`;
    }

    function formatTime(date) {
      const hour = date.getHours();
      const minute = date.getMinutes();

      return `${formatHour(hour)}:${formatMinute(minute)}`;
    }

    function formatHour(hour) {
      return (hour % 12 || 12).toString();
    }

    function formatMinute(minute) {
      return minute < 10 ? `0${minute}` : minute.toString();
    }

    return (
        <>
          {comments.length ? (
            <div className='all-comments-div'>
              {comments.map((comment) => (
                <div key={comment.id} className='each-comment-div'>
                  <div className='comment-img-username'>
                    <div className='comment-username-div'>{comment.user_username}</div>
                    <div className='comment-img-div'>
                      <img className='comment-profile-img' src={comment.user_profile_image} alt='User profile' />
                    </div>
                  </div>
                  {editComment && editCommentId === comment.id ? (
                        <div>
                        <textarea
                            type="text"
                            required
                            className="comment-edit-field"
                            name="comment_text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                        />
                        <button onClick={(e) => submitUpdatedComment(comment.id, editCommentText, e)} className="comment-edit-confirm-button">
                            Update
                        </button>
                    </div>
                  ) : (
                    <div>
                      <div className='comment-text-div'>{comment.comment_text}</div>
                      <div className='comment-edit-delete-div'>
                        <button
                          className='comment-edit-button'
                          hidden={sessionUserId !== comment.user_id}
                          onClick={(e) => updateCommentHandler(comment.id, comment.comment_text, e)}
                        >
                          Edit
                        </button>
                        <button
                          className='comment-delete-button'
                          hidden={sessionUserId !== comment.user_id}
                          onClick={(e) => deleteCommentHandler(comment.id, e)}
                        >
                          Delete
                        </button>
                        <div className='comment-date-time-div'>
                          {console.log(comment.updated_at)}
                        <span className='comment-date-time-span'>{formatDate(comment.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No comments available.</p>
          )}
        </>
      );
}

export default CommentList
