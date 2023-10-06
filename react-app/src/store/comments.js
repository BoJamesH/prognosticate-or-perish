const SET_COMMENTS = 'comments/SET_COMMENTS'
// const POST_COMMENTS = 'comments/POST_COMMENTS'

export const setComments = (comments) => ({
    type: SET_COMMENTS,
    payload: comments
})

// export const postComments = (comment) => ({
//     type: POST_COMMENTS,
//     payload: comment
// })


// export const postReactions = (message_id, reaction_type) => async (dispatch)=> {
//     console.log('REACTION STRING', reaction_type)
//     const response = await fetch(`/api/reactions/${message_id}`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({reaction_type})
//     })
//         console.log('POST MESSAGE RESPONSE', response)
//     if (response){
//         const newReaction = await response.json()
//         console.log(newReaction)
//         // server id in response?
//         dispatch(getReactions())
//     }
// }

export const getComments = () => async (dispatch) => {
    const response = await fetch(`/api/comments`)
    console.log('resonse: ', response)
    if(response.ok) {
        const getAllComments = await response.json();
        console.log('getAllComments:', getAllComments)
        const allComments = getAllComments.comments
        console.log('ALL COMMENTS------ ', allComments)
        dispatch(setComments(allComments))
    }
}

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
        const newMessage = await response.json();
        dispatch(getComments());
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
