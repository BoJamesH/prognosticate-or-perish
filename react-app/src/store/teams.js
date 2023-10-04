const SET_TEAMS = 'TEAMS/SET_TEAMS'


export const setTeams = (games) => ({
    type: SET_TEAMS,
    payload: games
});

export const getTeams = () => async (dispatch) => {
    try {
        const firstResponse = await fetch('/api/teams')
        const allTeams = await firstResponse.json()
        const teams = allTeams.teams;
        dispatch(setTeams(teams))
    } catch {
        console.log('Error fetching teams')
    }
}

const initialState = {
    allTeams: [],
}

export default function teamsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_TEAMS:
            return {...state, allTeams: action.payload}
        default:
            return state
    }
}
