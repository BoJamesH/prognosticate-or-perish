const SET_GAMES = 'GAMES/SET_GAMES'
const SET_WEEK = 'GAMES/SET_WEEK'


export const setGames = (games) => ({
    type: SET_GAMES,
    games
})

export const setWeek = (week) => ({
    type: SET_WEEK,
    week
})

export const getWeek = () => async (dispatch) => {
    const firstResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
    const response = await firstResponse.json()
    const currentWeek = Number(response.week.number)
    dispatch(setWeek(currentWeek))
}

export const getGames = (week) => async (dispatch) => {
    const firstResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
    const response = await firstResponse.json()
    if(response) {
        const events = response.events;
        console.log('EVENTS', events)
        let allCompetitors = [];
        let allOdds = [];
        const allGames = [];
        let allTeams = [];

        for (let i = 0; i < events.length; i++) {
            const games = events[i].competitions;
            for (let i = 0; i < games.length; i++) {
                const competitors = games[i].competitors;
                const odds = games[i].odds;
                for (let i = 0; i < odds.length; i++) {
                    allOdds.push(odds[i]);
                }
                for (let i = 0; i < competitors.length; i++) {
                    allCompetitors.push(competitors[i]);
                    const team = competitors[i].team;
                    allTeams.push(team);
                }
            }
        }
        for (let i = 0; i < allCompetitors.length; i += 2) {
            const game = {
                competitor1: allCompetitors[i],
                competitor2: allCompetitors[i + 1],
                odds: allOdds[i / 2],
                teams: [allTeams[i], allTeams[i + 1]],
            };
            allGames.push(game);
        }
        setWeek(Number(response.week.number))
        const game_week_data = allGames
        console.log(game_week_data)
        for (let i = 0; i < game_week_data.length; i++) {
            game_week_data[i].week = response.week.number
            game_week_data[i].year = response.season.year
        }
        // game_week_data.week = response.week.number
        // game_week_data.year = response.season.year
        console.log('game_week_data_frontend', game_week_data)
        const backResponse = await fetch('/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(game_week_data),
        })
    }
    dispatch(storeGames(week))
}

export const storeGames = (week) => async (dispatch) => {
    try {
        const response = await fetch(`/api/games/${week}`);  // Include the week in the URL
        const gameList = await response.json();
        dispatch(setGames(gameList.games));  // Assuming the response structure has a 'games' key
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// export const getMessages = (serverId, channelId) => async (dispatch) => {
//     const response = await fetch(`/api/${serverId}/${channelId}/messages`);
//     console.log('RESPONSE', response)
//     if (response) {
//         const getChannelMessages = await response.json();
//         // console.log('MADE THROUGH RESPONSE.OK')
//         const channelMessages = getChannelMessages.messages
//         dispatch(setMessages(channelMessages))
//     }
//     // console.log('BAD RESPONSE')
// }

const initialState = {
    allGames: {},
    currentWeek: {},
}

export default function gamesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_GAMES:
            return {...state, allGames: action.payload}
        case SET_WEEK:
            return {...state, currentWeek: action.payload}
        default:
            return state
    }
}
