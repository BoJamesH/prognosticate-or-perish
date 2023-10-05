import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../store/comments';


function CommentForm() {
    const dispatch = useDispatch()
    const user_profile_image = useSelector(state => state.session.user.profile_image)
    const user_username = useSelector(state => state.session.user.username)
    const user_id = useSelector(state => state.session.user.id)
    const [comment_text, set_comment_text] = useState('');

    const handleCommentChange = (e) => {
    set_comment_text(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            comment_text,
            user_profile_image,
            user_username
        };

        // onSubmit(newComment);
        dispatch(createComment(newComment))
        set_comment_text('');
    };

    return (
    <div>
        <h2>Leave a Comment</h2>
        <form onSubmit={handleSubmit}>
        <div>
            {/* <label htmlFor="comment">Comment:</label> */}
            <textarea
            id="comment"
            value={comment_text}
            onChange={handleCommentChange}
            required
            ></textarea>
        </div>
        <div>
            <button type="submit">Submit</button>
        </div>
        </form>
    </div>
    );
}

export default CommentForm;
