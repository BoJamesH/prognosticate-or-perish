from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class LastFetch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    last_fetch_timestamp = db.Column(db.DateTime)
