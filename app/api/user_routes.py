from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User

user_routes = Blueprint('users', __name__)


@user_routes.route('')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/profile_image', methods=['PUT'])
@login_required
def change_profile_image():
    """
    Change a user's profile image
    """
    try:
        user_id = int(current_user.get_id())
        fetch_data = request.get_json()
        user = User.query.get(user_id)
        user.profile_image = fetch_data['profile_image']
        db.session.commit()
        return {"Success": "Profile image update success"}
    except Exception as e:
        return jsonify({'error': 'Error updating profile image', 'details': str(e)})
