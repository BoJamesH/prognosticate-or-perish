from app.models import db, Team, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_teams():
    teams = [
        Team(city='SF', name='49ers', logo_small='https://imgur.com/L5bbjzC', logo_large='https://imgur.com/L5bbjzC', season_wins=4, season_losses=0, home_wins=2, home_losses=0, away_wins=2, away_losses=0),
        Team(city='AZ', name='Cardinals', logo_small='https://imgur.com/OVLLmUq', logo_large='https://imgur.com/OVLLmUq', season_wins=1, season_losses=3, home_wins=1, home_losses=1, away_wins=0, away_losses=2),
        Team(city='ATL', name='Falcons', logo_small='https://imgur.com/G7lLbuF', logo_large='https://imgur.com/G7lLbuF', season_wins=2, season_losses=2, home_wins=2, home_losses=0, away_wins=0, away_losses=2),
        Team(city='BAL', name='Ravens', logo_small='https://imgur.com/GE7gypL', logo_large='https://imgur.com/GE7gypL', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='BUF', name='Bills', logo_small='https://imgur.com/QIFmYy9', logo_large='https://imgur.com/QIFmYy9', season_wins=3, season_losses=1, home_wins=2, home_losses=0, away_wins=1, away_losses=1),
        Team(city='CAR', name='Panthers', logo_small='https://imgur.com/QNYIjmP', logo_large='https://imgur.com/QNYIjmP', season_wins=0, season_losses=4, home_wins=0, home_losses=2, away_wins=0, away_losses=2),
        Team(city='CHI', name='Bears', logo_small='https://imgur.com/7ul389a', logo_large='https://imgur.com/7ul389a', season_wins=0, season_losses=4, home_wins=0, home_losses=2, away_wins=0, away_losses=2),
        Team(city='CIN', name='Bengals', logo_small='https://imgur.com/M6BUQQg', logo_large='https://imgur.com/M6BUQQg', season_wins=1, season_losses=3, home_wins=1, home_losses=1, away_wins=0, away_losses=2),
        Team(city='CLE', name='Browns', logo_small='https://imgur.com/XBEG7cJ', logo_large='https://imgur.com/XBEG7cJ', season_wins=2, season_losses=2, home_wins=2, home_losses=1, away_wins=0, away_losses=1),
        Team(city='DAL', name='Cowboys', logo_small='https://imgur.com/G9vC9pf', logo_large='https://imgur.com/G9vC9pf', season_wins=3, season_losses=1, home_wins=2, home_losses=0, away_wins=1, away_losses=1),
        Team(city='DEN', name='Broncos', logo_small='https://imgur.com/uwPtu42', logo_large='https://imgur.com/uwPtu42', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='DET', name='Lions', logo_small='https://imgur.com/NG9FScp', logo_large='https://imgur.com/NG9FScp', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='GB', name='Packers', logo_small='https://imgur.com/c6nma7B', logo_large='https://imgur.com/c6nma7B', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='HOU', name='Texans', logo_small='https://imgur.com/rgfG79N', logo_large='https://imgur.com/rgfG79N', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='IND', name='Colts', logo_small='https://imgur.com/WV2Qn7H', logo_large='https://imgur.com/WV2Qn7H', season_wins=2, season_losses=2, home_wins=0, home_losses=2, away_wins=2, away_losses=0),
        Team(city='JAX', name='Jaguars', logo_small='https://imgur.com/3r9B1S8', logo_large='https://imgur.com/3r9B1S8', season_wins=2, season_losses=2, home_wins=1, home_losses=2, away_wins=1, away_losses=0),
        Team(city='KC', name='Chiefs', logo_small='https://imgur.com/H6g08qU', logo_large='https://imgur.com/H6g08qU', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='LAC', name='Chargers', logo_small='https://imgur.com/60EZe5e', logo_large='https://imgur.com/60EZe5e', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='LAR', name='Rams', logo_small='https://imgur.com/h8cnGLS', logo_large='https://imgur.com/h8cnGLS', season_wins=2, season_losses=2, home_wins=0, home_losses=1, away_wins=2, away_losses=1),
        Team(city='LV', name='Raiders', logo_small='https://imgur.com/sk46DXJ', logo_large='https://imgur.com/sk46DXJ', season_wins=1, season_losses=3, home_wins=0, home_losses=1, away_wins=1, away_losses=2),
        Team(city='MIA', name='Dolphins', logo_small='https://imgur.com/zrvPKZB', logo_large='https://imgur.com/zrvPKZB', season_wins=3, season_losses=1, home_wins=1, home_losses=0, away_wins=2, away_losses=1),
        Team(city='MIN', name='Vikings', logo_small='https://imgur.com/QaeaRn5', logo_large='https://imgur.com/QaeaRn5', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='NE', name='Patriots', logo_small='https://imgur.com/eYo9S6h', logo_large='https://imgur.com/eYo9S6h', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='NO', name='Saints', logo_small='https://imgur.com/dsmCIrd', logo_large='https://imgur.com/dsmCIrd', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='NYG', name='Giants', logo_small='https://imgur.com/h27yDmv', logo_large='https://imgur.com/h27yDmv', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='NYJ', name='Jets', logo_small='https://imgur.com/nbA5I4x', logo_large='https://imgur.com/nbA5I4x', season_wins=1, season_losses=3, home_wins=1, home_losses=2, away_wins=0, away_losses=1),
        Team(city='PHI', name='Eagles', logo_small='https://imgur.com/CE2J50g', logo_large='https://imgur.com/CE2J50g', season_wins=4, season_losses=0, home_wins=2, home_losses=0, away_wins=2, away_losses=0),
        Team(city='PIT', name='Steelers', logo_small='https://imgur.com/PQ9eOdr', logo_large='https://imgur.com/PQ9eOdr', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='SEA', name='Seahawks', logo_small='https://imgur.com/Vbobr8P', logo_large='https://imgur.com/Vbobr8P', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='TB', name='Buccaneers', logo_small='https://imgur.com/UuZsw4T', logo_large='https://imgur.com/UuZsw4T', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='TEN', name='Titans', logo_small='https://imgur.com/B5Spd6k', logo_large='https://imgur.com/B5Spd6k', season_wins=2, season_losses=2, home_wins=2, home_losses=0, away_wins=0, away_losses=2),
        Team(city='WAS', name='Commanders', logo_small='https://imgur.com/KwSseyU', logo_large='https://imgur.com/KwSseyU', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
    ]

    for team in teams:
        db.session.add(team)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_teams():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.teams RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM teams"))

    db.session.commit()
