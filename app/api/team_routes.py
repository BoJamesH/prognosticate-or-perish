from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import db, Team

team_routes = Blueprint('teams', __name__)

@team_routes.route('')
def get_teams():
    try:
        teams = Team.query.all()
        team_data = [team.to_dict() for team in teams]
        return jsonify({'teams': team_data})
    except Exception as e:
        return jsonify({'error': 'Error retrieving games', 'details': str(e)})
