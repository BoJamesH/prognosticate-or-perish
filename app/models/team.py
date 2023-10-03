from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Team(db.Model):
    __tablename__ = 'teams'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(50), unique=True)
    logo_small = db.Column(db.String)
    logo_large = db.Column(db.String)
    season_wins = db.Column(db.Integer)
    season_losses = db.Column(db.Integer)
    home_wins = db.Column(db.Integer)
    home_losses = db.Column(db.Integer)
    away_wins = db.Column(db.Integer)
    away_losses = db.Column(db.Integer)
    avg_points_scored = db.Column(db.Integer)
    avg_points_allowed = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'city': self.city,
            'name': self.name,
            'logo_small': self.logo_small,
            'logo_large': self.logo_large,
            'season_wins': self.season_wins,
            'season_losses': self.season_losses,
            'home_wins': self.home_wins,
            'home_losses': self.home_losses,
            'away_wins': self.away_wins,
            'away_losses': self.away_losses,
            'avg_points_scored': self.avg_points_scored,
            'avg_points_allowed': self.avg_points_allowed,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
