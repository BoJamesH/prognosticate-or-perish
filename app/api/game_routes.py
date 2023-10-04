from flask import Blueprint, jsonify, request
from app.models import db, Game
from flask_login import current_user, login_required
from datetime import datetime

game_routes = Blueprint('games', __name__)

comment_routes = Blueprint('comment_routes', __name__)

@game_routes.route('', methods=['POST'])
@login_required
def create_games():
    # data = request.get_json()
    # print('DATA-----------', data)
    try:
        data = request.get_json()
        all_games_data = data
        # print('BACKEND GAME DATA', data)
        for game_data in all_games_data:
            competitor1 = game_data['competitor1']
            competitor2 = game_data['competitor2']
            odds = game_data['odds']
            # teams = game_data['teams']
            # print('ODDS', odds)
            print(competitor1['team']['name'])
            print(competitor2['team']['name'])
            print(odds['details'])
            print(odds['overUnder'])
            game = Game(
                week=5,  # Replace with actual week data
                year=2023,  # Replace with actual year data
                home_team_name=competitor1['team']['name'],  # Replace with actual team IDs
                away_team_name=competitor2['team']['name'],  # Replace with actual team IDs
                spread=odds['details'],
                over_under=int(odds['overUnder']),
            )
            print(game)
            db.session.add(game)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'message': 'Game records created successfully'})
    except Exception as e:
        return jsonify({'error': 'Error creating game records', 'details': str(e)})
