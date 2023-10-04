from app.models import db, Elim_Pick, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_elim_picks():
    sample_pick = Elim_Pick(user_id=3, week=5, game_id=1, selected_team_id=1, status='OPEN')
    db.session.add(sample_pick)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_elim_picks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.elim_picks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM elim_picks"))

    db.session.commit()
