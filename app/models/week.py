from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Week(db.Model):
    __tablename__ = 'weeks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    current_week = db.Column(db.Integer)
    current_year = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'current_week': self.current_week,
            'current_year': self.current_year,
        }
