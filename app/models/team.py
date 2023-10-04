from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Team(db.Model):
    __tablename__ = 'teams'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    # result_winner = db.relationship('Result', back_populates='winner_result')
    # result_loser = db.relationship('Result', back_populates='loser_result')
    spread_elim_picks_team = db.relationship('Spread_Elim_Pick', back_populates='team_spread_elim_picks', cascade='all, delete-orphan')
    over_under_bets_team = db.relationship('Over_Under_Bet', back_populates='team_over_under_bets', cascade='all, delete-orphan')
    spread_bets_team = db.relationship('Spread_Bet', back_populates='team_spread_bets', cascade='all, delete-orphan')
    elim_picks_team = db.relationship('Elim_Pick', back_populates='team_elim_picks', cascade='all, delete-orphan')
    pickem_picks_team = db.relationship('Pickem_Pick', back_populates='team_pickem_picks', cascade='all, delete-orphan')
    spread_elim_picks_team = db.relationship('Spread_Elim_Pick', back_populates='team_spread_elim_picks', cascade='all, delete-orphan')


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
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
