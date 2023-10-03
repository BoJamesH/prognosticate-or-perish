from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Game(db.Model):
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    start_date_time = db.Column(db.DateTime)
    week = db.Column(db.Integer)
    year = db.Column(db.Integer)
    home_team_id = db.Column(db.Integer)
    away_team_id = db.Column(db.Integer)
    home_spread = db.Column(db.Float)
    away_spread = db.Column(db.Float)
    home_spread_odds = db.Column(db.Integer)
    away_spread_odds = db.Column(db.Integer)
    over_under = db.Column(db.Integer)
    over_odds = db.Column(db.Integer)
    under_odds = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'start_date_time': self.start_date_time,
            'week': self.week,
            'year': self.year,
            'home_team_id': self.home_team_id,
            'away_team_id': self.away_team_id,
            'home_spread': self.home_spread,
            'away_spread': self.away_spread,
            'home_spread_odds': self.home_spread_odds,
            'away_spread_odds': self.away_spread_odds,
            'over_under': self.over_under,
            'over_odds': self.over_odds,
            'under_odds': self.under_odds,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
