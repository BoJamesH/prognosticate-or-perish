const SET_COMMENTS = 'comments/SET_COMMENTS'
// const POST_COMMENTS = 'comments/POST_COMMENTS'

export const setComments = (comments) => ({
    type: SET_COMMENTS,
    payload: comments
})

export const getComments = () => async (dispatch) => {
    try {
      const response = await fetch(`/api/comments`);
      console.log('response: ', response);

      if (response.ok) {
        const getAllComments = await response.json();
        console.log('getAllComments:', getAllComments);
        const allComments = getAllComments.comments;
        console.log('ALL COMMENTS------ ', allComments);
        dispatch(setComments(allComments));
      } else {
        // Handle non-ok response, e.g., by dispatching an error action
        console.error('Error fetching comments:', response.statusText);
        // You can dispatch an error action here if needed
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('An error occurred while fetching comments:', error);
      // You can dispatch an error action here if needed
    }
  };

export const createComment = (comment) => async (dispatch) => {
    const response = await fetch('/api/comments', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment)
    });

    console.log('RESPONSE POST COMMENT-----', response);
    if (response.ok) {
        const newComment = await response.json();
        dispatch(getComments());
    }
}

export const updateComment = (comment_id, comment_text) => async (dispatch) => {
    try {
        const response = await fetch(`/api/comments/${comment_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment_text),
        });
        if (response.ok) {
            dispatch(getComments())
        }
    } catch (e) {
        console.error('Error message: ', e)
    }
}

export const deleteComment = (comment_id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/comments/${comment_id}`, {
            method: 'DELETE',
        })
        console.log('resonse: ', response)
        if (response.ok) {
            dispatch(getComments())
        }
    } catch (e) {
        console.log(e)
    }
}

const initialState = {
    allComments: {}
}

export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_COMMENTS:
            return {...state, allComments: action.payload}
        default:
            return state
    }
}
