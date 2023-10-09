from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Elim_Pick(db.Model):
    __tablename__ = 'elim_picks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    week = db.Column(db.Integer)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')))
    selected_team_name = db.Column(db.String)
    status = db.Column(db.String, default='OPEN')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_elim_picks = db.relationship('User', back_populates='elim_picks_user')
    game_elim_picks = db.relationship('Game', back_populates='elim_picks_game')
    # team_elim_picks = db.relationship('Team', back_populates='elim_picks_team')


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'week': self.week,
            'game_id': self.game_id,
            'selected_team_name': self.selected_team_name,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
