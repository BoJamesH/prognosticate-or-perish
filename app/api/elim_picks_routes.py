from flask import Blueprint, jsonify, request
from app.models import db, Elim_Pick, Week, Game, User
from flask_login import current_user, login_required

elim_pick_routes = Blueprint('elim_picks', __name__)


@elim_pick_routes.route('')
@login_required
def user_elim_picks():
    """
    Query for all user eliminator picks and return them in a list of pick dictionaries.
    """
    user_id = int(current_user.get_id())
    try:
        picks = Elim_Pick.query.filter_by(user_id=user_id).all()
        return jsonify({'user_elim_picks': [pick.to_dict() for pick in picks]})
    except Exception as e:
        return jsonify({'error': 'Error fetching user picks', 'details': str(e)})


@elim_pick_routes.route('', methods=['POST'])
@login_required
def post_elim_pick():
    """
    Select an eliminator pick as a logged-in user.
    """
    try:
        elim_pick_data = request.get_json()
        user_id = int(current_user.get_id())
        week = elim_pick_data.get('week')
        existing_pick = Elim_Pick.query.filter_by(user_id=user_id, week=week).first()
        if existing_pick:
            existing_pick.game_id = elim_pick_data['gameId']
            existing_pick.selected_team_name = elim_pick_data['name']
            db.session.commit()
            return {"Success": "Pick update success"}
        else:
            # Create a new Elim_Pick record
            fresh_pick = Elim_Pick(
                user_id=user_id,
                week = elim_pick_data['week'],
                game_id = elim_pick_data['gameId'],
                selected_team_name = elim_pick_data['name'],
            )
            db.session.add(fresh_pick)
            db.session.commit()
            return {"Success": "Pick creation success"}
    except Exception as e:
        return jsonify({'error': 'Error posting pick', 'details': str(e)})


# @comment_routes.route('/<comment_id>', methods=['DELETE'])
# @login_required
# def delete_comment(comment_id):
#     """
#     Delete a comment by the owner of the comment
#     """
#     try:
#         comment_to_delete = Comment.query.get(comment_id)
#         db.session.delete(comment_to_delete)
#         db.session.commit()
#         return {'Success': 'Comment deleted'}
#     except Exception as e:
#         return jsonify({'error': 'Error deleting comment', 'details': str(e)})

@elim_pick_routes.route('/<int:week>', methods=['DELETE'])
@login_required
def delete_elim_pick(week):
    """
    Delete the eliminator pick of the current user for the specified week.
    """
    user_id = int(current_user.get_id())
    try:
        pick = Elim_Pick.query.filter_by(user_id=user_id, week=week).first()
        if pick:
            db.session.delete(pick)
            db.session.commit()
            return jsonify({'message': 'Eliminator pick deleted successfully'})
        else:
            return jsonify({'message': 'Eliminator pick not found for the specified week'})
    except Exception as e:
        return jsonify({'error': 'Error deleting user pick', 'details': str(e)})


@elim_pick_routes.route('/check')
@login_required
def check_eliminator_picks():
    current_week = Week.query.first().current_week
    try:
        current_picks = Elim_Pick.query.filter_by(week=current_week).all()

        if not current_picks:
            return jsonify({'message': 'No eliminator picks found for the current week'})

        for current_pick in current_picks:
            if current_pick.status in ('WIN', 'LOSS', 'TIE'):
                continue
            print('INSIDE ELIM PICK CHECK ROUTE LOOP CURRENT PICK---- ', current_pick)
            game = Game.query.get(current_pick.game_id)
            pick_user = User.query.get(current_pick.user_id)
            if game.completed:
                winning_team_name = game.determine_winning_team()
                if winning_team_name == 'TIE':
                    current_pick.status = 'TIE'
                    pick_user.elim_ties += 1
                elif winning_team_name == current_pick.selected_team_name:
                    current_pick.status = 'WIN'
                    pick_user.elim_wins += 1
                else:
                    current_pick.status = 'LOSS'
                    pick_user.elim_losses += 1

        db.session.commit()

        return jsonify({'message': 'Eliminator picks for the current week updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Error updating eliminator picks', 'details': str(e)})
