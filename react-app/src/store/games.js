const SET_GAMES = 'GAMES/SET_GAMES'
const SET_WEEK = 'GAMES/SET_WEEK'


export const setGames = (games) => ({
    type: SET_GAMES,
    payload: games
});

export const setWeek = (week) => ({
    type: SET_WEEK,
    payload: week
})

export const getAPIWeek = () => async (dispatch) => {
    console.log('HITTING API WEEK FETCH!!!!!!!!!')
    try {
        const firstResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
        const response = await firstResponse.json()
        const currentWeek = response.week.number
        dispatch(setWeek(currentWeek))
        const backendSetWeek = await fetch('/api/week', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(currentWeek)
        });
    } catch (e) {
        console.error('Error fetching API week:', e);
    }
}

export const storeWeek = () => async (dispatch) => {
    try {
        const response = await fetch(`/api/week`);
        const res = await response.json();
        const currentWeek = res.week.current_week
        dispatch(setWeek(Number(currentWeek)));
    } catch (e) {
        console.error('Error fetching week:', e);
    }
};

export const getAPIGames = () => async (dispatch) => {
    console.log('HITTING API GAMES FETCH!!!!!!!!!')
    try {
        const firstResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
        const response = await firstResponse.json()
        if(response.ok) {
            const events = response.events;
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
            const game_week_data = allGames
            for (let i = 0; i < game_week_data.length; i++) {
                game_week_data[i].week = response.week.number
                game_week_data[i].year = response.season.year
            }
            // game_week_data.week = response.week.number
            // game_week_data.year = response.season.year
            const backResponse = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game_week_data),
            })
        }

    } catch (e) {
        console.log(e)
    }
    dispatch(storeGames())
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
