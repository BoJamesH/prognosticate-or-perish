import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComments } from '../../store/comments';
import '../CommentList/commentList.css'

function CommentListGuest() {
  const dispatch = useDispatch();
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const comments = useSelector((state) => state.comments.allComments);

  useEffect(() => {
    dispatch(getComments());
  }, [dispatch]);

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
        <div className="all-comments-div" style={{ marginTop: '60px' }}>
            <h3 className='guest-comment-title'>Chatter</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="each-comment-div">
              <div className="comment-img-username">
                <div className="comment-username-div">{comment.user_username}</div>
                <div className="comment-img-div">
                  <img
                    className="comment-profile-img"
                    src={comment.user_profile_image}
                    alt="User profile"
                  />
                </div>
              </div>
                <div>
                  <div className="comment-text-div">{comment.comment_text}</div>
                  <div className="comment-date-time-div">
                    <span className="comment-date-time-span">{formatDate(comment.updated_at)}</span>
                  </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments available.</p>
      )}
    </>
  );
}

export default CommentListGuest;
