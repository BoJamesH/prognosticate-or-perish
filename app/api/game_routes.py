from flask import Blueprint, jsonify, request
from flask_login import login_required
from datetime import datetime, timedelta
from app.models import db, Game, LastFetch, Week

game_routes = Blueprint('games', __name__)

@game_routes.route('', methods=['POST'])
@login_required
def create_games():
    try:
        print('ENTERED BACKEND GAMES ROUTE')
        all_games_data = request.get_json()
        # print('BACKEND ALL GAMES API DATA------ ', all_games_data)
        # Check and update the current week and year in the weeks table
        current_week_record = Week.query.first()
        print('CURRENT WEEK RECORD ---------', current_week_record)
        if not current_week_record or (current_week_record.current_year != all_games_data[0]['year'] or current_week_record.current_week != all_games_data[0]['week']):
            if not current_week_record:
                current_week_record = Week()
            print('ENTERED CONDITIONAL FOR CHECKING CURRENT WEEK')
            current_week_record.current_week = all_games_data[0]['week']
            current_week_record.current_year = all_games_data[0]['year']
            db.session.add(current_week_record)
            db.session.commit()
        print('DIRECTLY ABOVE LOOP FOR ADDING GAMES')
        for game_data in all_games_data:
            print('ENTERED LOOP FOR ADDING AND UPDATING GAMES!!!')
            espn_id = int(game_data['espn_id'])
            # Check if a game with the same espn_id exists
            existing_game = Game.query.filter_by(espn_id=espn_id).first()
            print('DID WE FIND AN EXISTING GAME??? ', existing_game)
            if existing_game:
                # Update the existing game record
                # if game_data['odds'] == 'Game finished':
                #     game_data['odds']['overUnder'] == 'Game finished'
                #     game_data['odds']['details'] == 'Game finished'
                existing_game.week = int(game_data['week'])
                existing_game.year = int(game_data['year'])
                existing_game.home_team_name = game_data['competitor1']['team']['name']
                existing_game.away_team_name = game_data['competitor2']['team']['name']
                existing_game.spread = game_data['odds']['details']
                existing_game.over_under = int(game_data['odds']['overUnder'])
                existing_game.home_team_score = int(game_data['competitor1']['score'])
                existing_game.away_team_score = int(game_data['competitor2']['score'])
                existing_game.completed = game_data['completed']
            else:
                print('ENTERED GAME CREATION STEP!!!!!!!!!')
                game = Game(
                    espn_id=int(espn_id),
                    week=int(game_data['week']),
                    year=int(game_data['year']),
                    home_team_name=game_data['competitor1']['team']['name'],
                    away_team_name=game_data['competitor2']['team']['name'],
                    spread=game_data['odds']['details'],
                    over_under=int(game_data['odds']['overUnder']),
                    home_team_score=int(game_data['competitor1']['score']),
                    away_team_score=int(game_data['competitor2']['score']),
                    completed=game_data['completed']
                )
                db.session.add(game)
                db.session.commit()

        db.session.commit()

        return jsonify({'message': 'Game records created and data updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Error creating or updating game records', 'details': str(e)})


@game_routes.route('')
def get_games():
    try:
        games = Game.query.all()
        game_data = [game.to_dict() for game in games]
        return jsonify({'games': game_data})
    except Exception as e:
        return jsonify({'error': 'Error retrieving games', 'details': str(e)})
