const SET_COMMENTS = 'comments/SET_COMMENTS'


export const setComments = (comments) => ({
    type: SET_COMMENTS,
    payload: comments
})



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
        dispatch(setComments(allComments))
    }
    console.log("Bad Response")
}

// export const deleteReaction = (reaction_id, message_id) => async (dispatch) => {
//     const response = await fetch(`/api/reactions/${reaction_id}`, {
//         method: 'DELETE',
//     })
//     if (response.ok) {
//         dispatch(getReactions(message_id))
//     }
// }

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
