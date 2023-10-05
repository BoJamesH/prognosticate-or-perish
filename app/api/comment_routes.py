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
    comments = Comment.query.order_by(Comment.created_at.desc()).limit(50).all()
    print(comments)
    return {'comments': [comment.to_dict() for comment in comments]}

@comment_routes.route('', methods=['POST'])
@login_required
def post_comment():
    """
    Post a comment as a logged in user.
    """
    this_thing = request.get_json()
    user_id = int(current_user.get_id())
    new_message = Comment(
        comment_text = this_thing['comment_text'],
        user_id = user_id,
        user_profile_image = this_thing['user_profile_image'],
        user_username = this_thing['user_username']
    )
    db.session.add(new_message)
    db.session.commit()
    return {"Success": "Message creation success"}
    return {"Error": "Message creation failed"}, 500
