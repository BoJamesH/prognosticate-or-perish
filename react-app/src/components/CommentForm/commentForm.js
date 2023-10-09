import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/comments';
import './commentForm.css'

function CommentForm() {
    const dispatch = useDispatch()
    const user_profile_image = useSelector(state => state.session.user.profile_image)
    const user_username = useSelector(state => state.session.user.username)
    const [comment_text, set_comment_text] = useState('');

    const handleCommentChange = (e) => {
    set_comment_text(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment_text.length > 4000) {
            alert('Please limit comments to less than 4,000 characters.')
            return
        }
        const newComment = {
            comment_text,
            user_profile_image,
            user_username
        };
        dispatch(createComment(newComment))
        set_comment_text('');

    };

    return (
    <div>
        <h3 className='leave-comment-title-h3'>Leave a Comment</h3>
        <form onSubmit={handleSubmit}>
        <div className='textarea-input-div'>
            <textarea
            id="comment"
            value={comment_text}
            onChange={handleCommentChange}
            required
            className='comment-field'
            placeholder='Got something to share?'
            ></textarea>
        </div>
        <div className='submit-comment-div'>
            <button className='submit-comment-button' type="submit">Comment</button>
        </div>
        </form>
    </div>
    );
}

export default CommentForm;
