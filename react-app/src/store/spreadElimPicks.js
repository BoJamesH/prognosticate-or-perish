const SET_SPREAD_ELIM_PICKS= 'comments/SET_SPREAD_ELIM_PICKS'

export const setSpreadElimPicks = (picks) => ({
    type: SET_SPREAD_ELIM_PICKS,
    payload: picks
})

export const getUserSpreadElimPicks = () => async (dispatch) => {
    try {
      const response = await fetch(`/api/spread_elim_picks`);
      console.log('response: ', response);
      if (response.ok) {
        const getUserSpreadElimPicks = await response.json();
        console.log('getUserSpreadElimPicks:', getUserSpreadElimPicks);
        const userSpreadElimPicks = getUserSpreadElimPicks.user_spread_elim_picks;
        console.log('USER SPREAD ELIM PICKS ------ ', userSpreadElimPicks);
        dispatch(setSpreadElimPicks(userSpreadElimPicks));
      }
    } catch (error) {
      console.error('Error fetching user Spread Eliminator picks:', error);
    }
  };


export const postUserSpreadElimPick = (spread, name, gameId, week, completed, selectedTeamScore, opposingTeamScore) => async (dispatch) => {
    const pickBody = { spread, name, gameId, week, completed, selectedTeamScore, opposingTeamScore };
    try {
        const response = await fetch('/api/spread_elim_picks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pickBody)
        });
        if (response.ok) {
            const newPick = await response.json();
            dispatch(getUserSpreadElimPicks());
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

export const checkUserSpreadElimPicks = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/spread_elim_picks/check`);
        console.log('response: ', response);
        if (response.ok) {
            const checkUserSpreadElimPicks = await response.json();
            console.log('CHECK USER SPREAD ELIM PICK RESPONSE:', checkUserSpreadElimPicks);
        } else {
            console.error('Error checking user spread elim picks');
        }
    } catch (error) {
        console.error('Error in checkUserSpreadElimPicks:', error);
    }
};


export const deleteUserSpreadElimPick = (week) => async (dispatch) => {
    try {
        const response = await fetch(`/api/spread_elim_picks/${week}`, {
            method: 'DELETE',
        })
        if (response.ok) {
            dispatch(getUserSpreadElimPicks())
        }
    } catch (e) {
        console.error('Error in deleteUserSpreadElimPicks:', e);
    }
}

const initialState = {
    userSpreadElimPicks: []
}

export default function spreadElimPicksReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SPREAD_ELIM_PICKS:
            return {...state, userSpreadElimPicks: action.payload}
        default:
            return state
    }
}
