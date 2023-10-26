const SET_PICK_EM_PICKS= 'comments/SET_PICK_EM_PICKS'

export const setPickEmPicks = (picks) => ({
    type: SET_PICK_EM_PICKS,
    payload: picks
})

export const getUserPickEmPicks = () => async (dispatch) => {
    try {
      const response = await fetch(`/api/pick_em_picks`);
      console.log('response: ', response);
      if (response.ok) {
        const getUserPickEmPicks = await response.json();
        console.log('getUserPickEmPicks:', getUserPickEmPicks);
        const userPickEmPicks = getUserPickEmPicks.user_pick_em_picks;
        console.log('USER PickEm PICKS ------ ', userPickEmPicks);
        dispatch(setPickEmPicks(userPickEmPicks));
      }
    } catch (error) {
      console.error('Error fetching user PickEm picks:', error);
    }
  };


export const postUserPickEmPick = (selected_team_name, gameId, week, completed, selectedTeamScore, opposingTeamScore) => async (dispatch) => {
    const pickBody = { selected_team_name, gameId, week, completed, selectedTeamScore, opposingTeamScore };
    try {
        const response = await fetch('/api/pick_em_picks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pickBody)
        });
        if (response.ok) {
            const newPick = await response.json();
            dispatch(getUserPickEmPicks());
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

export const checkUserPickEmPicks = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/pick_em_picks/check`);
        console.log('response: ', response);
        if (response.ok) {
            const checkUserElimPicks = await response.json();
            console.log('CHECK USER PICK EM PICK RESPONSE:', checkUserElimPicks);
        } else {
            console.error('Error checking user elim picks');
        }
    } catch (error) {
        console.error('Error checking user pick em picks:', error);
    }
};


export const deleteUserPickEmPick = (game_id) => async (dispatch) => {
    try {
        const response = await fetch(`/api/pick_em_picks/${game_id}`, {
            method: 'DELETE',
        })
        if (response.ok) {
            dispatch(getUserPickEmPicks())
        }
    } catch (e) {
        console.error('Error deleting user pick em pick:', e);
    }
}

const initialState = {
    userPickEmPicks: []
}

export default function pickEmPicksReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PICK_EM_PICKS:
            return {...state, userPickEmPicks: action.payload}
        default:
            return state
    }
}
