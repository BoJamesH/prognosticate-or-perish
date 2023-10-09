from flask import Blueprint, jsonify, request
from app.models import db, Elim_Pick
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
def post_comment():
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
