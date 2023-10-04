const SET_GAMES = 'GAMES/SET_GAMES'


export const setGames = (games) => ({
    type: SET_GAMES,
    payload: games
})



// export const postReactions = (message_id, reaction_type) => async (dispatch)=> {
//     console.log('REACTION STRING', reaction_type)
//     const response = await fetch(`/api/reactions/${message_id}`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({reaction_type})
//     })
//         console.log('POST MESSAGE RESPONSE', response)
//     if (response){
//         const newReaction = await response.json()
//         console.log(newReaction)
//         // server id in response?
//         dispatch(getReactions())
//     }
// }

export const getGames = () => async (dispatch) => {
    const firstResponse = await fetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`, {
        // method: "GET",
        // headers: {
		// 	"Content-Type": "application/json",
		// },
    })
    console.log('firstResponse: ', firstResponse)
    const response = await firstResponse.json()
    console.log('response---------- ', response)
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
        const game_week_data = allGames
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
        if (response) {
            dispatch(setGames(allGames))
        }
    }
    console.log("Bad Response")
}

// export const deleteReaction = (reaction_id, message_id) => async (dispatch) => {
//     const response = await fetch(`/api/reactions/${reaction_id}`, {
//         method: 'DELETE',
//     })
//     if (response.ok) {
//         dispatch(getReactions(message_id))
//     }
// }

const initialState = {
    allGames: {}
}

export default function gamesReducer(state = initialState, action) {
    switch (action.type) {
        case SET_GAMES:
            return {...state, allGames: action.payload}
        default:
            return state
    }
}
