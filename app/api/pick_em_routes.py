from flask import Blueprint, jsonify, request
from app.models import db, Pickem_Pick, Game, Week, User
from flask_login import current_user, login_required

pick_em_pick_routes = Blueprint('pick_em_picks', __name__)


@pick_em_pick_routes.route('')
@login_required
def user_pick_em_picks():
    """
    Query for all user pick 'em picks and return them in a list of pick dictionaries.
    """
    user_id = int(current_user.get_id())
    try:
        picks = Pickem_Pick.query.filter_by(user_id=user_id).all()
        return jsonify({'user_pick_em_picks': [pick.to_dict() for pick in picks]})
    except Exception as e:
        return jsonify({'error': 'Error fetching user picks', 'details': str(e)})


@pick_em_pick_routes.route('', methods=['POST'])
@login_required
def post_pick_em():
    """
    Select a pick 'em pick as a logged-in user.
    """
    try:
        print('ENTERED PICK EM PICK POST ROUTE!!!!!')
        pick_em_pick_data = request.get_json()
        user_id = int(current_user.get_id())
        game_id = pick_em_pick_data.get('gameId')
        existing_pick = Pickem_Pick.query.filter_by(user_id=user_id, game_id=game_id).first()
        if existing_pick:
            print('FOUND EXISTING PICK EM PICK !!!!! ', existing_pick)
            existing_pick.selected_team_name = pick_em_pick_data['selected_team_name']
            db.session.commit()
            return {"Success": "Pick update success"}
        else:
            # Create a new Pickem_Pick record
            fresh_pick = Pickem_Pick(
                user_id=user_id,
                week = pick_em_pick_data['week'],
                game_id = pick_em_pick_data['gameId'],
                selected_team_name = pick_em_pick_data['selected_team_name'],
            )
            db.session.add(fresh_pick)
            db.session.commit()
            return {"Success": "Pick creation success"}
    except Exception as e:
        return jsonify({'error': 'Error posting pick', 'details': str(e)})

@pick_em_pick_routes.route('/<int:game_id>', methods=['DELETE'])
@login_required
def delete_pick_em_pick(game_id):
    """
    Delete the pick_em pick of the current user for the specified week.
    """
    user_id = int(current_user.get_id())
    try:
        pick = Pickem_Pick.query.filter_by(user_id=user_id, game_id=game_id).first()
        if pick:
            db.session.delete(pick)
            db.session.commit()
            return jsonify({'message': 'Pick em pick deleted successfully'})
        else:
            return jsonify({'message': 'Pick em pick not found for the specified week'})
    except Exception as e:
        return jsonify({'error': 'Error deleting user pick', 'details': str(e)})


from flask import jsonify

@pick_em_pick_routes.route('/check')
@login_required
def check_pick_em_picks():
    week = Week.query.first()
    current_week = week.current_week
    try:
        current_picks = Pickem_Pick.query.filter_by(week=current_week).all()
        print('CURRENT WEEK PICK EM PICKS------------- ', current_picks)
        if not current_picks:
            return jsonify({'message': 'No picks found for the current week'})

        for current_pick in current_picks:
            if current_pick.status in ('WIN', 'LOSS', 'TIE'):
                continue  # Skip picks that are already final
            game = Game.query.get(current_pick.game_id)
            pick_user = User.query.get(current_pick.user_id)
            if game.completed:
                game_final_status = game.determine_winning_team()
                if game_final_status == 'TIE':
                    current_pick.status = 'TIE'
                    pick_user.pick_ties += 1
                elif game_final_status == current_pick.selected_team_name:
                    current_pick.status = 'WIN'
                    pick_user.pick_wins += 1
                else:
                    current_pick.status = 'LOSS'
                    pick_user.pick_losses += 1

        db.session.commit()

        return jsonify({'message': 'All Pick Em picks for the current week updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Error updating Pick Em picks', 'details': str(e)})
