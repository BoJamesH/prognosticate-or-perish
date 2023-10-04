from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Over_Under_Bet(db.Model):
    __tablename__ = 'over_under_bets'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    week = db.Column(db.Integer)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')))
    selected_team_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('teams.id')))
    progs_wagered = db.Column(db.Integer)
    payout = db.Column(db.Float)
    status = db.Column(db.String, default='OPEN')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_over_under_bets = db.relationship('User', back_populates='over_under_bets_user')
    game_over_under_bets = db.relationship('Game', back_populates='over_under_bets_game')
    team_over_under_bets = db.relationship('Team', back_populates='over_under_bets_team')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'week': self.week,
            'game_id': self.game_id,
            'selected_team_id': self.selected_team_id,
            'progs_wagered': self.progs_wagered,
            'payout': self.payout,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
