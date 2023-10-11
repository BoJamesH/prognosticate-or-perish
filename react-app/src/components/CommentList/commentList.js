import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteComment, getComments, updateComment } from '../../store/comments';
import './commentList.css';


const CommentList = () => {
    const dispatch = useDispatch();
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
