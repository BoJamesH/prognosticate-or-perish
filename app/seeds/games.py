from app.models import db, Game, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_games():
    example_game_1 = Game(start_date_time="2023-10-08T00:15Z", week=5, year=2023, home_team_id=1, away_team_id=10, home_spread=-2.5, away_spread=2.5, home_spread_odds=-109, away_spread_odds=-109, over_under=40.5, under_odds=-109, over_odds=-109)
    example_game_2 = Game(start_date_time="2023-10-09T13:00Z", week=5, year=2023, home_team_id=15, away_team_id=7, home_spread=3.5, away_spread=-3.5, home_spread_odds=-109, away_spread_odds=-109, over_under=48.0, under_odds=-109, over_odds=-109)
    example_game_3 = Game(start_date_time="2023-10-09T16:25Z", week=5, year=2023, home_team_id=12, away_team_id=31, home_spread=-6.5, away_spread=6.5, home_spread_odds=-109, away_spread_odds=-109, over_under=44.5, under_odds=-109, over_odds=-109)
    example_game_4 = Game(start_date_time="2023-10-09T20:20Z", week=5, year=2023, home_team_id=24, away_team_id=20, home_spread=1.5, away_spread=-1.5, home_spread_odds=-109, away_spread_odds=-109, over_under=51.0, under_odds=-109, over_odds=-109)
    example_game_5 = Game(start_date_time="2023-10-10T21:15Z", week=5, year=2023, home_team_id=6, away_team_id=29, home_spread=-5.5, away_spread=5.5, home_spread_odds=-109, away_spread_odds=-109, over_under=43.5, under_odds=-109, over_odds=-109)

    db.session.add(example_game_1)
    db.session.add(example_game_2)
    db.session.add(example_game_3)
    db.session.add(example_game_4)
    db.session.add(example_game_5)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_games():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM games"))

    db.session.commit()
