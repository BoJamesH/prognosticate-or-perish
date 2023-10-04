from flask import Blueprint, jsonify, request
from flask_login import login_required
from datetime import datetime, timedelta
from app.models import db, Game, LastFetch

game_routes = Blueprint('games', __name__)

@game_routes.route('', methods=['POST'])
@login_required
def create_games():
    try:
        # Check the last fetch timestamp from the database
        last_fetch_record = LastFetch.query.first()
        print(last_fetch_record)

        if not last_fetch_record or (datetime.utcnow() - last_fetch_record.last_fetch_timestamp >= timedelta(days=7)):
            data = request.get_json()
            all_games_data = data
            for game_data in all_games_data:
                competitor1 = game_data['competitor1']
                competitor2 = game_data['competitor2']
                odds = game_data['odds']
                game_week = game_data['week']
                game_year = game_data['year']
                game = Game(
                    week=game_week,  # Replace with actual week data
                    year=game_year,  # Replace with actual year data
                    home_team_name=competitor1['team']['name'],  # Replace with actual team data
                    away_team_name=competitor2['team']['name'],  # Replace with actual team data
                    spread=odds['details'],
                    over_under=int(odds['overUnder']),
                )
                db.session.add(game)

            # Update the last fetch timestamp
            if not last_fetch_record:
                last_fetch_record = LastFetch()
                db.session.add(last_fetch_record)

            last_fetch_record.last_fetch_timestamp = datetime.utcnow()
            db.session.commit()

            return jsonify({'message': 'Game records created and data updated successfully'})
        print('HITTING DATA FETCHED MESSAGE')
        return jsonify({'message': 'Data was fetched within the last week'})
    except Exception as e:
        return jsonify({'error': 'Error creating game records', 'details': str(e)})

@game_routes.route('/<week>', methods=['GET'])
def get_games(week):
    try:
        games = Game.query.filter_by(week=week).all()
        game_data = [game.to_dict() for game in games]
        return jsonify({'games': game_data})
    except Exception as e:
        return jsonify({'error': 'Error retrieving games', 'details': str(e)})
