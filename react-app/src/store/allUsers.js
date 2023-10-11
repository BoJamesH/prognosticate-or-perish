const SET_ALL_USERS = 'allUsers/SET_ALL_USERS'

export const setAllUsers = (users) => ({
    type: SET_ALL_USERS,
    payload: users
})

export const getAllUsers = () => async (dispatch) => {
    const response = await fetch(`/api/users`)
    console.log('resonse: ', response)
    if(response.ok) {
        const getAllUsers = await response.json();
        const allUsers = getAllUsers.users
        dispatch(setAllUsers(allUsers))
    }
}

const initialState = {
    allUsers: []
}

export default function allUsersReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ALL_USERS:
            return {...state, allUsers: action.payload}
        default:
            return state
    }
}
