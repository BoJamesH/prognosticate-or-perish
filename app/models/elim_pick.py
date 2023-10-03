from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Elim_Pick(db.Model):
    __tablename__ = 'elim_picks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    game_id = db.Column(db.String(40))
    selected_team_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'selected_team_id': self.selected_team_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
