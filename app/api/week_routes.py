from flask import Blueprint, jsonify, request
from app.models import db, Week
from flask_login import current_user, login_required
from datetime import datetime

week_routes = Blueprint('week', __name__)


@week_routes.route('')
@login_required
def get_week():
    """
    Query for the current week to prevent excessive API calls
    """
    try:
        week = Week.query.first()
        if week:
            return {'week': week.to_dict()}
        else:
            return {'week': None} 
    except Exception as e:
        return jsonify({'error': 'Error fetching week', 'details': str(e)})


@week_routes.route('', methods=['PUT'])
@login_required
def update_week():
    """
    Update the current week in the Week table.
    """
    try:
        data = request.get_json()
        new_week = data['currentWeek']
        week_to_update = Week.query.first()
        week_to_update.current_week = new_week
        db.session.commit()
        return {"Success": "Week update success"}
    except Exception as e:
        return jsonify({'error': 'Error updating week', 'details': str(e)})
