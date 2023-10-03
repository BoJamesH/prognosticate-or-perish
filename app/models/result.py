from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Result(db.Model):
    __tablename__ = 'results'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, nullable=False)
    home_score = db.Column(db.Integer, nullable=False)
    away_score = db.Column(db.Integer, nullable=False)
    total_points = db.Column(db.Integer, nullable=False)
    winner_id = db.Column(db.Integer, nullable=False)
    loser_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'home_score': self.home_score,
            'away_score': self.away_score,
            'total_points': self.total_points,
            'away_team_id': self.away_team_id,
            'winner_id': self.winner_id,
            'loser_id': self.loser_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
