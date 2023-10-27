const SET_OVER_UNDER_BETS= 'overUnderBets/SET_OVER_UNDER_BETS'

export const setOverUnderBets = (bets) => ({
    type: SET_OVER_UNDER_BETS,
    payload: bets
})

export const getUserOverUnderBets = () => async (dispatch) => {
    try {
      const response = await fetch(`/api/over_under_bets`);
      if (response.ok) {
        const getUserOverUnderBets = await response.json();
        console.log('getUserOverUnderBets:', getUserOverUnderBets);
        const userOverUnderBets = getUserOverUnderBets.user_over_under_bets;
        console.log('USER PickEm PICKS ------ ', userOverUnderBets);
        dispatch(setOverUnderBets(userOverUnderBets));
      }
    } catch (error) {
      console.error('Error fetching user over/under bets:', error);
    }
  };


export const postUserOverUnderBet = (gameId, status, betAmount, payout, week) => async (dispatch) => {
    const betBody = { gameId, status, betAmount, payout, week };
    try {
        const response = await fetch('/api/over_under_bets', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(betBody)
        });
        if (response.ok) {
            const newPick = await response.json();
            dispatch(getUserOverUnderBets());
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

export const checkUserOverUnderBets = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/over_under_bets/check`);
        if (response.ok) {
            const checkUserOverUnderBets = await response.json();
            console.log('CHECK OVER UNDER RESPONSE:', checkUserOverUnderBets);
        } else {
            console.error('Error checking over under bets');
        }
    } catch (error) {
        console.error('Error checking user over under bets:', error);
    }
};

const initialState = {
    userOverUnderBets: []
}

export default function overUnderBetsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_OVER_UNDER_BETS:
            return {...state, userOverUnderBets: action.payload}
        default:
            return state
    }
}
