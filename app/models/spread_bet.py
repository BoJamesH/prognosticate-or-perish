from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Spread_Bet(db.Model):
    __tablename__ = 'spread_bets'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    week = db.Column(db.Integer)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')))
    selected_team_name = db.Column(db.String)
    progs_wagered = db.Column(db.Integer)
    status = db.Column(db.String, default='OPEN')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_spread_bets = db.relationship('User', back_populates='spread_bets_user')
    game_spread_bets = db.relationship('Game', back_populates='spread_bets_game')
    # team_spread_bets = db.relationship('Team', back_populates='spread_bets_team')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'week': self.week,
            'game_id': self.game_id,
            'selected_team_name': self.selected_team_name,
            'progs_wagered': self.progs_wagered,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
