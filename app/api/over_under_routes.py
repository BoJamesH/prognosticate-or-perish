from flask import Blueprint, jsonify, request
from app.models import db, Over_Under_Bet, User, Week, Game
from flask_login import current_user, login_required

over_under_routes = Blueprint('over_under_bets', __name__)


@over_under_routes.route('')
@login_required
def user_over_under_bets():
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

@over_under_routes.route('/check')
@login_required
def check_over_under_bets():
    week = Week.query.first()
    current_week = week.current_week
    try:
        current_over_under_bets = Over_Under_Bet.query.filter_by(week=current_week).all()
        print('CURRENT WEEK OVER UNDER BETS ------------- ', current_over_under_bets)
        if not current_over_under_bets:
            return jsonify({'message': 'No over under bets found for the current week'})

        for current_bet in current_over_under_bets:
            if current_bet.status in ('WIN', 'LOSS', 'PUSH'):
                continue
            game = Game.query.get(current_bet.game_id)
            pick_user = User.query.get(current_bet.user_id)
            if game.completed:
                game_ou_status = game.determine_over_under_status()
                if game_ou_status == current_bet.status:
                    current_bet.status = 'WIN'
                    pick_user.prognosticoins += current_bet.payout
                elif game_ou_status != current_bet.status:
                    current_bet.status = 'LOSS'
                elif game_ou_status == 'PUSH':
                    current_bet.status = 'PUSH'
                    pick_user.prognosticoins += current_bet.progs_wagered
                else:
                    return jsonify({'message': 'Unknown status of game or bet, bet not updated.'})
        db.session.commit()
        return jsonify({'message': 'All Over/Under Bets for the current week updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Error checking Over/Under Bets', 'details': str(e)})
