from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Columns
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    user_username = db.Column(db.String(40))
    comment_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    # Relationships
    user_comments = db.relationship('User', back_populates='comments_user')
    username_comments = db.relationship('User', back_populates='comments_username')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_username': self.user_username,
            'comment_text': self.comment_text,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
