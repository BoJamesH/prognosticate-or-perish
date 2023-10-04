from flask import Blueprint
from app.models import db, User, Comment
from flask_login import current_user, login_required

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('')
@login_required
def all_comments():
    """
    Query for all comments and return them in a list of comments dictionaries.
    """
    comments = Comment.query.all()
    return {'comments': [comment.to_dict() for comment in comments]}
