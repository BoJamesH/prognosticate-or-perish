from flask import Blueprint, jsonify, request
from app.models import db, Pickem_Pick
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


# # @comment_routes.route('/<comment_id>', methods=['DELETE'])
# # @login_required
# # def delete_comment(comment_id):
# #     """
# #     Delete a comment by the owner of the comment
# #     """
# #     try:
# #         comment_to_delete = Comment.query.get(comment_id)
# #         db.session.delete(comment_to_delete)
# #         db.session.commit()
# #         return {'Success': 'Comment deleted'}
# #     except Exception as e:
# #         return jsonify({'error': 'Error deleting comment', 'details': str(e)})

# @elim_pick_routes.route('/<int:week>', methods=['DELETE'])
# @login_required
# def delete_elim_pick(week):
#     """
#     Delete the eliminator pick of the current user for the specified week.
#     """
#     user_id = int(current_user.get_id())
#     try:
#         pick = Elim_Pick.query.filter_by(user_id=user_id, week=week).first()
#         if pick:
#             db.session.delete(pick)
#             db.session.commit()
#             return jsonify({'message': 'Eliminator pick deleted successfully'})
#         else:
#             return jsonify({'message': 'Eliminator pick not found for the specified week'})
#     except Exception as e:
#         return jsonify({'error': 'Error deleting user pick', 'details': str(e)})


# @elim_pick_routes.route('/check')
# @login_required
# def check_eliminator_picks():
#     user_id = int(current_user.get_id())
#     week = Week.query.first()
#     current_week = week.current_week
#     try:
#         current_pick = Elim_Pick.query.filter_by(user_id=user_id, week=current_week).first()

#         if current_pick.status in ('WIN', 'LOSS', 'TIE'):
#             return jsonify({'message': 'Pick status is already final'})

#         game = Game.query.get(current_pick.game_id)
#         if game.completed:
#             winning_team_name = game.determine_winning_team()
#             if winning_team_name == 'TIE':
#                 current_pick.status = 'TIE'
#                 current_user.elim_ties += 1
#             if winning_team_name == current_pick.selected_team_name:
#                 current_pick.status = 'WIN'
#                 current_user.elim_wins += 1
#             else:
#                 current_pick.status = 'LOSS'
#                 current_user.elim_losses += 1

#         db.session.commit()

#         return jsonify({'message': 'Eliminator picks updated successfully'})
#     except Exception as e:
#         return jsonify({'error': 'Error updating eliminator picks', 'details': str(e)})
