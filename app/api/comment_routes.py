from flask import Blueprint, jsonify, request
from app.models import db, User, Comment
from flask_login import current_user, login_required
from app.forms.comment_form import CommentForm
from datetime import datetime

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('')
@login_required
def all_comments():
    """
    Query for all comments and return them in a list of comments dictionaries.
    """
    try:
        comments = Comment.query.order_by(Comment.created_at.desc()).limit(50).all()
        print(comments)
        return {'comments': [comment.to_dict() for comment in comments]}
    except Exception as e:
        return jsonify({'error': 'Error fetching comments', 'details': str(e)})

@comment_routes.route('', methods=['POST'])
@login_required
def post_comment():
    """
    Post a comment as a logged in user.
    """
    try:
        this_thing = request.get_json()
        user_id = int(current_user.get_id())
        new_comment = Comment(
            comment_text = this_thing['comment_text'],
            user_id = user_id,
            user_profile_image = this_thing['user_profile_image'],
            user_username = this_thing['user_username']
        )
        db.session.add(new_comment)
        db.session.commit()
        return {"Success": "Comment creation success"}
    except Exception as e:
        return jsonify({'error': 'Error posting comment', 'details': str(e)})

@comment_routes.route('/<comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    """
    Delete a comment by the owner of the comment
    """
    print('ENTERED DELETE COMMENT HANDLER')
    try:
        print('ENTERED DELETE COMMENT HANDLER')
        comment_to_delete = Comment.query.get(comment_id)
        db.session.delete(comment_to_delete)
        db.session.commit()
        return {'Success': 'Comment deleted'}
    except Exception as e:
        return jsonify({'error': 'Error deleting comment', 'details': str(e)})
