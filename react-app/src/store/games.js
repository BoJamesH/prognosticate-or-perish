const SET_GAMES = 'games/SET_GAMES'
const SET_WEEK = 'games/SET_WEEK'


export const setGames = (games) => ({
    type: SET_GAMES,
    payload: games
});

export const setWeek = (week) => ({
    type: SET_WEEK,
    payload: week
})

// export const getAPIWeek = () => async (dispatch) => {
//     console.log('HITTING API WEEK FETCH!!!!!!!!!')
//     try {
//         const firstResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
//         const response = await firstResponse.json()
//         const currentWeek = response.week.number
//         dispatch(setWeek(currentWeek))
//         const backendSetWeek = await fetch('/api/week', {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(currentWeek)
//         });
//     } catch (e) {
//         console.error('Error fetching API week:', e);
//     }
// }

export const storeWeek = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/week`);
        const res = await response.json();
        const currentWeek = res.week.current_week
        dispatch(setWeek(Number(11)));
    } catch (e) {
        console.error('Error fetching week:', e);
    }
};

export const getAPIGames = () => async (dispatch) => {
    console.log('HITTING API GAMES FETCH!!!!!!!!!')
    try {
        const firstResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
        const response = await firstResponse.json()
        if(true) {
            const events = response.events;
            console.log('EVENTSSSSS IN BACKEND ----------', events)
            let allCompetitors = [];
            let allOdds = [];
            const allGames = [];
            let allTeams = [];
            const allStatuses = [];
            for (let i = 0; i < events.length; i++) {
                const games = events[i].competitions;
                for (let k = 0; k < games.length; k++) {
                    const competitors = games[k].competitors;
                    const status = games[k].status.type.completed
                    if (games[k].odds) {
                        const odds = games[k].odds;
                        allOdds.push(odds[0])
                    } else {
                        const odds = {}
                        odds.overUnder = 0
                        odds.details = 'Game finished'
                        allOdds.push(odds);
                    }
                    allStatuses.push(status)
                    // const statuses = games[k].status.type.completed
                    // for (let j = 0; j < games.length; j++) {
                    //     allStatuses.push(statuses[k])
                    // }
                    for (let l = 0; l < competitors.length; l++) {
                        allCompetitors.push(competitors[l]);
                        const team = competitors[l].team;
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
                    completed: allStatuses[i / 2]
                };
                allGames.push(game);
            }
            const game_week_data = allGames
            for (let i = 0; i < game_week_data.length; i++) {
                game_week_data[i].week = response.week.number
                game_week_data[i].year = response.season.year
                game_week_data[i].espn_id = events[i].id
            }
            console.log('GAME WEEK API DATA!!!!!!!!!!!!--', game_week_data)
            const backResponse = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game_week_data),
            })
        }
    } catch (e) {
        console.error(e)
    }
}

export const storeGames = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/games`);
        const games = await response.json();
        const gameList = games.games
        dispatch(setGames(gameList));
    } catch (error) {
        console.error('Error fetching games:', error);
    }
};

const initialState = {
    allGames: [],
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
