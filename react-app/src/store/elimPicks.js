const SET_ELIM_PICKS= 'comments/SET_ELIM_PICKS'

export const setElimPicks = (picks) => ({
    type: SET_ELIM_PICKS,
    payload: picks
})

export const getUserElimPicks = () => async (dispatch) => {
    const response = await fetch(`/api/elim_picks`)
    console.log('response: ', response)
    if(response.ok) {
        const getUserElimPicks = await response.json();
        console.log('getUserElimPicks:', getUserElimPicks)
        const userElimPicks = getUserElimPicks.user_elim_picks
        console.log('USER ELIM PICKS ------ ', userElimPicks)
        dispatch(setElimPicks(userElimPicks))
    }
}

export const postUserElimPick = (name, gameId, week, completed, selectedTeamScore, opposingTeamScore) => async (dispatch) => {
    const pickBody = { name, gameId, week, completed, selectedTeamScore, opposingTeamScore };
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

export const checkUserElimPicks = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/elim_picks/check`);
        console.log('response: ', response);
        if (response.ok) {
            const checkUserElimPicks = await response.json();
            console.log('CHECK USER ELIM PICK RESPONSE:', checkUserElimPicks);
            // Dispatch any actions or handle the response as needed here
        } else {
            console.error('Error checking user elim picks');
        }
    } catch (error) {
        console.error('Error in checkUserElimPicks:', error);
    }
};


export const deleteUserElimPick = (week) => async (dispatch) => {
    try {
        const response = await fetch(`/api/elim_picks/${week}`, {
            method: 'DELETE',
        })
        if (response.ok) {
            dispatch(getUserElimPicks())
        }
    } catch (e) {
        console.error('Error in deleteUserElimPicks:', e);
    }
}

const initialState = {
    userElimPicks: []
}

export default function elimPicksReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ELIM_PICKS:
            return {...state, userElimPicks: action.payload}
        default:
            return state
    }
}
