from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Result(db.Model):
    __tablename__ = 'results'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')))
    home_score = db.Column(db.Integer, nullable=False)
    away_score = db.Column(db.Integer, nullable=False)
    total_points = db.Column(db.Integer, nullable=False)
    winner_name = db.Column(db.String)
    loser_name = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    game_result = db.relationship('Game', back_populates='result_game')

    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'home_score': self.home_score,
            'away_score': self.away_score,
            'total_points': self.total_points,
            'winner_name': self.winner_name,
            'loser_name': self.loser_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
