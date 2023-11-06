const SET_SPREAD_BETS= 'spreadBets/SET_SPREAD_BETS'

export const setSpreadBets = (bets) => ({
    type: SET_SPREAD_BETS,
    payload: bets
})

export const getUserSpreadBets = () => async (dispatch) => {
    try {
      const response = await fetch(`/api/spread_bets`);
      if (response.ok) {
        const getUserSpreadBets = await response.json();
        // console.log('getUserSpreadBets:', getUserSpreadBets);
        const userSpreadBets = getUserSpreadBets.user_spread_bets;
        // console.log('USER Spread Bets ------ ', userSpreadBets);
        dispatch(setSpreadBets(userSpreadBets));
      }
    } catch (error) {
      console.error('Error fetching user spread bets:', error);
    }
  };


export const postUserSpreadBet = (gameId, status, betAmount, payout, week) => async (dispatch) => {
    const betBody = { gameId, status, betAmount, payout, week };
    try {
        const response = await fetch('/api/spread_bets', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(betBody)
        });
        if (response.ok) {
            const newPick = await response.json();
            dispatch(getUserSpreadBets());
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

export const checkUserSpreadBets = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/spread_bets/check`);
        if (response.ok) {
            const checkUserSpreadBets = await response.json();
            console.log('CHECK SPREAD RESPONSE:', checkUserSpreadBets);
        } else {
            console.error('Error checking spread bets');
        }
    } catch (error) {
        console.error('Error checking user spread bets:', error);
    }
};

const initialState = {
    userSpreadBets: []
}

export default function SpreadBetsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_OVER_UNDER_BETS:
            return {...state, userSpreadBets: action.payload}
        default:
            return state
    }
}
