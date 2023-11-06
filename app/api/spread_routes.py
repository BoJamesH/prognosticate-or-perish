from flask import Blueprint, jsonify, request
from app.models import db, Spread_Bet, User, Week, Game
from flask_login import current_user, login_required

spread_routes = Blueprint('spread_bets', __name__)


@spread_routes.route('')
@login_required
def user_spread_bets():
    """
    Query for all user spread bets and return them in a list of bet dictionaries.
    """
    user_id = int(current_user.get_id())
    try:
        ou_bets = Spread_Bet.query.filter_by(user_id=user_id).all()
        return jsonify({'user_spread_bets': [bet.to_dict() for bet in ou_bets]})
    except Exception as e:
        return jsonify({'error': 'Error fetching user spread bets', 'details': str(e)})


@spread_routes.route('', methods=['POST'])
@login_required
def post_spread_bet():
    """
    Make a spread bet as a logged-in user.
    """
    try:
        ## gameId, status, betAmount, payout, week
        print('ENTERED SPREAD BET POST ROUTE!!!!!')
        spread_bet_data = request.get_json()
        user_id = int(current_user.get_id())

        user = User.query.get(user_id)
        user.prognosticoins -= spread_bet_data['betAmount']

        new_spread_bet = Spread_Bet(
            user_id=user_id,
            week=spread_bet_data['week'],
            game_id=spread_bet_data['gameId'],
            selected_team_name = spread_bet_data['teamName'],
            progs_wagered=spread_bet_data['betAmount'],
            payout=spread_bet_data['payout'],
        )

        db.session.add(new_spread_bet)
        db.session.commit()

        return {"Success": "Spread bet creation success"}
    except Exception as e:
        print(str(e))
        return {"Error": "An error occurred while processing the bet"}

# @spread_routes.route('/check')
# @login_required
# def check_spread_bets():
#     week = Week.query.first()
#     current_week = week.current_week
#     try:
#         current_spread_bets = Spread_Bet.query.filter_by(week=current_week).all()
#         print('CURRENT WEEK OVER UNDER BETS ------------- ', current_spread_bets)
#         if not current_spread_bets:
#             return jsonify({'message': 'No over under bets found for the current week'})

#         for current_bet in current_spread_bets:
#             if current_bet.status in ('WIN', 'LOSS', 'PUSH'):
#                 continue
#             game = Game.query.get(current_bet.game_id)
#             pick_user = User.query.get(current_bet.user_id)
#             if game.completed:
#                 game_ou_status = game.determine_spread_bet_status()
#                 if game_ou_status == current_bet.status:
#                     current_bet.status = 'WIN'
#                     pick_user.prognosticoins += current_bet.payout
#                     current_bet.payout = 0
#                 elif game_ou_status != current_bet.status:
#                     current_bet.status = 'LOSS'
#                     current_bet.payout = 0
#                 elif game_ou_status == 'PUSH':
#                     current_bet.status = 'PUSH'
#                     pick_user.prognosticoins += current_bet.progs_wagered
#                     current_bet.payout = 0
#                 else:
#                     return jsonify({'message': 'Unknown status of game or bet, bet not updated.'})
#         db.session.commit()
#         return jsonify({'message': 'All Over/Under Bets for the current week updated successfully'})
#     except Exception as e:
#         return jsonify({'error': 'Error checking Over/Under Bets', 'details': str(e)})
