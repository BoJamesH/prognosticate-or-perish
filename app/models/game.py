from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Game(db.Model):
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    week = db.Column(db.Integer)
    year = db.Column(db.Integer)
    home_team_name = db.Column(db.String)
    away_team_name = db.Column(db.String)
    spread = db.Column(db.String)
    over_under = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    result_game = db.relationship('Result', back_populates='game_result', cascade='all, delete-orphan')
    spread_elim_picks_game = db.relationship('Spread_Elim_Pick', back_populates='game_spread_elim_picks', cascade='all, delete-orphan')
    pickem_picks_game = db.relationship('Pickem_Pick', back_populates='game_pickem_picks', cascade='all, delete-orphan')
    elim_picks_game = db.relationship('Elim_Pick', back_populates='game_elim_picks', cascade='all, delete-orphan')
    over_under_bets_game = db.relationship('Over_Under_Bet', back_populates='game_over_under_bets', cascade='all, delete-orphan')
    spread_bets_game = db.relationship('Spread_Bet', back_populates='game_spread_bets', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'week': self.week,
            'year': self.year,
            'home_team_name': self.home_team_name,
            'away_team_name': self.away_team_name,
            'spread': self.spread,
            'over_under': self.over_under,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
