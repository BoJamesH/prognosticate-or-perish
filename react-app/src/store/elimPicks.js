const SET_ELIM_PICKS= 'comments/SET_ELIM_PICKS'

export const setElimPicks = (pick) => ({
    type: SET_ELIM_PICKS,
    payload: pick
})

export const getUserElimPicks = () => async (dispatch) => {
    const response = await fetch(`/api/elim_picks`)
    console.log('resonse: ', response)
    if(response.ok) {
        const getUserElimPicks = await response.json();
        console.log('getUserElimPicks:', getUserElimPicks)
        const userElimPicks = getUserElimPicks.elim_picks
        console.log('USER ELIM PICKS ------ ', userElimPicks)
        dispatch(setElimPicks(userElimPicks))
    }
}

export const postElimPick = (name, gameIdESPN, week, completed) => async (dispatch) => {
    const pickBody = { name, gameIdESPN, week, completed };
    try {
        const response = await fetch('/api/elim_picks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pickBody)
        });

        if (response.ok) {
            const newPick = await response.json();
            dispatch(getUserElimPicks());
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};


// export const updateComment = (comment_id, comment_text) => async (dispatch) => {
//     try {
//         const response = await fetch(`/api/comments/${comment_id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(comment_text),
//         });
//         if (response.ok) {
//             dispatch(getComments())
//         }
//     } catch (e) {
//         console.error('Error message: ', e)
//     }
// }

// export const deleteComment = (comment_id) => async (dispatch) => {
//     try {
//         const response = await fetch(`/api/comments/${comment_id}`, {
//             method: 'DELETE',
//         })
//         console.log('resonse: ', response)
//         if (response.ok) {
//             dispatch(getComments())
//         }
//     } catch (e) {
//         console.log(e)
//     }
// }

const initialState = {
    userElimPicks: {}
}

export default function elimPicksReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ELIM_PICKS:
            return {...state, userElimPicks: action.payload}
        default:
            return state
    }
}
