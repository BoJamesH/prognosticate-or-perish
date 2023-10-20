from flask import Blueprint, jsonify, request
from app.models import db, Over_Under_Bet, User
from flask_login import current_user, login_required

over_under_routes = Blueprint('over_under_bets', __name__)


@over_under_routes.route('')
@login_required
def user_pick_em_picks():
    """
    Query for all user over/under bets and return them in a list of bet dictionaries.
    """
    user_id = int(current_user.get_id())
    try:
        ou_bets = Over_Under_Bet.query.filter_by(user_id=user_id).all()
        return jsonify({'user_over_under_bets': [bet.to_dict() for bet in ou_bets]})
    except Exception as e:
        return jsonify({'error': 'Error fetching user picks', 'details': str(e)})


@over_under_routes.route('', methods=['POST'])
@login_required
def post_over_under_bet():
    """
    Make an over/under bet as a logged-in user.
    """
    try:
        ## gameId, status, betAmount, payout, week
        print('ENTERED OVER UNDER BET POST ROUTE!!!!!')
        ou_bet_data = request.get_json()
        user_id = int(current_user.get_id())

        user = User.query.get(user_id)
        user.prognosticoins -= ou_bet_data['betAmount']

        new_ou_bet = Over_Under_Bet(
            user_id=user_id,
            week=ou_bet_data['week'],
            game_id=ou_bet_data['gameId'],
            progs_wagered=ou_bet_data['betAmount'],
            payout=ou_bet_data['payout'],
            status=ou_bet_data['status']
        )

        db.session.add(new_ou_bet)
        db.session.commit()

        return {"Success": "Over/under bet creation success"}
    except Exception as e:
        print(str(e))
        return {"Error": "An error occurred while processing the bet"}

# @over_under_routes.route.route('/<int:game_id>', methods=['DELETE'])
# @login_required
# def delete_pick_em_pick(game_id):
#     """
#     Delete the pick_em pick of the current user for the specified week.
#     """
#     user_id = int(current_user.get_id())
#     try:
#         pick = Pickem_Pick.query.filter_by(user_id=user_id, game_id=game_id).first()
#         if pick:
#             db.session.delete(pick)
#             db.session.commit()
#             return jsonify({'message': 'Pick em pick deleted successfully'})
#         else:
#             return jsonify({'message': 'Pick em pick not found for the specified week'})
#     except Exception as e:
#         return jsonify({'error': 'Error deleting user pick', 'details': str(e)})


# from flask import jsonify

# @over_under_routes.route.route('/check')
# @login_required
# def check_pick_em_picks():
#     week = Week.query.first()
#     current_week = week.current_week
#     try:
#         current_picks = Pickem_Pick.query.filter_by(week=current_week).all()
#         print('CURRENT WEEK PICK EM PICKS------------- ', current_picks)
#         if not current_picks:
#             return jsonify({'message': 'No picks found for the current week'})

#         for current_pick in current_picks:
#             if current_pick.status in ('WIN', 'LOSS', 'TIE'):
#                 continue
#             game = Game.query.get(current_pick.game_id)
#             pick_user = User.query.get(current_pick.user_id)
#             if game.completed:
#                 game_final_status = game.determine_winning_team()
#                 if game_final_status == 'TIE':
#                     current_pick.status = 'TIE'
#                     pick_user.pick_ties += 1
#                 elif game_final_status == current_pick.selected_team_name:
#                     current_pick.status = 'WIN'
#                     pick_user.pick_wins += 1
#                 else:
#                     current_pick.status = 'LOSS'
#                     pick_user.pick_losses += 1

#         db.session.commit()

#         return jsonify({'message': 'All Pick Em picks for the current week updated successfully'})
#     except Exception as e:
#         return jsonify({'error': 'Error updating Pick Em picks', 'details': str(e)})
