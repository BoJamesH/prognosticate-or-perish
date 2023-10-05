from app.models import db, Team, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_teams():
    teams = [
        Team(city='SF', name='49ers', logo_small='https://imgur.com/L5bbjzC.png', logo_large='https://imgur.com/L5bbjzC.png', season_wins=4, season_losses=0, home_wins=2, home_losses=0, away_wins=2, away_losses=0),
        Team(city='AZ', name='Cardinals', logo_small='https://imgur.com/OVLLmUq.png', logo_large='https://imgur.com/OVLLmUq.png', season_wins=1, season_losses=3, home_wins=1, home_losses=1, away_wins=0, away_losses=2),
        Team(city='ATL', name='Falcons', logo_small='https://imgur.com/G7lLbuF.png', logo_large='https://imgur.com/G7lLbuF.png', season_wins=2, season_losses=2, home_wins=2, home_losses=0, away_wins=0, away_losses=2),
        Team(city='BAL', name='Ravens', logo_small='https://imgur.com/GE7gypL.png', logo_large='https://imgur.com/GE7gypL.png', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='BUF', name='Bills', logo_small='https://imgur.com/QIFmYy9.png', logo_large='https://imgur.com/QIFmYy9.png', season_wins=3, season_losses=1, home_wins=2, home_losses=0, away_wins=1, away_losses=1),
        Team(city='CAR', name='Panthers', logo_small='https://imgur.com/QNYIjmP.png', logo_large='https://imgur.com/QNYIjmP.png', season_wins=0, season_losses=4, home_wins=0, home_losses=2, away_wins=0, away_losses=2),
        Team(city='CHI', name='Bears', logo_small='https://imgur.com/7ul389a.png', logo_large='https://imgur.com/7ul389a.png', season_wins=0, season_losses=4, home_wins=0, home_losses=2, away_wins=0, away_losses=2),
        Team(city='CIN', name='Bengals', logo_small='https://imgur.com/M6BUQQg.png', logo_large='https://imgur.com/M6BUQQg.png', season_wins=1, season_losses=3, home_wins=1, home_losses=1, away_wins=0, away_losses=2),
        Team(city='CLE', name='Browns', logo_small='https://imgur.com/XBEG7cJ.png', logo_large='https://imgur.com/XBEG7cJ.png', season_wins=2, season_losses=2, home_wins=2, home_losses=1, away_wins=0, away_losses=1),
        Team(city='DAL', name='Cowboys', logo_small='https://imgur.com/G9vC9pf.png', logo_large='https://imgur.com/G9vC9pf.png', season_wins=3, season_losses=1, home_wins=2, home_losses=0, away_wins=1, away_losses=1),
        Team(city='DEN', name='Broncos', logo_small='https://imgur.com/uwPtu42.png', logo_large='https://imgur.com/uwPtu42.png', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='DET', name='Lions', logo_small='https://imgur.com/NG9FScp.png', logo_large='https://imgur.com/NG9FScp.png', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='GB', name='Packers', logo_small='https://imgur.com/c6nma7B.png', logo_large='https://imgur.com/c6nma7B.png', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='HOU', name='Texans', logo_small='https://imgur.com/rgfG79N.png', logo_large='https://imgur.com/rgfG79N.png', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='IND', name='Colts', logo_small='https://imgur.com/WV2Qn7H.png', logo_large='https://imgur.com/WV2Qn7H.png', season_wins=2, season_losses=2, home_wins=0, home_losses=2, away_wins=2, away_losses=0),
        Team(city='JAX', name='Jaguars', logo_small='https://imgur.com/3r9B1S8.png', logo_large='https://imgur.com/3r9B1S8.png', season_wins=2, season_losses=2, home_wins=1, home_losses=2, away_wins=1, away_losses=0),
        Team(city='KC', name='Chiefs', logo_small='https://imgur.com/H6g08qU.png', logo_large='https://imgur.com/H6g08qU.png', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='LAC', name='Chargers', logo_small='https://imgur.com/60EZe5e.png', logo_large='https://imgur.com/60EZe5e.png', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='LAR', name='Rams', logo_small='https://imgur.com/h8cnGLS.png', logo_large='https://imgur.com/h8cnGLS.png', season_wins=2, season_losses=2, home_wins=0, home_losses=1, away_wins=2, away_losses=1),
        Team(city='LV', name='Raiders', logo_small='https://imgur.com/sk46DXJ.png', logo_large='https://imgur.com/sk46DXJ.png', season_wins=1, season_losses=3, home_wins=0, home_losses=1, away_wins=1, away_losses=2),
        Team(city='MIA', name='Dolphins', logo_small='https://imgur.com/zrvPKZB.png', logo_large='https://imgur.com/zrvPKZB.png', season_wins=3, season_losses=1, home_wins=1, home_losses=0, away_wins=2, away_losses=1),
        Team(city='MIN', name='Vikings', logo_small='https://imgur.com/QaeaRn5.png', logo_large='https://imgur.com/QaeaRn5.png', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='NE', name='Patriots', logo_small='https://imgur.com/eYo9S6h.png', logo_large='https://imgur.com/eYo9S6h.png', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='NO', name='Saints', logo_small='https://imgur.com/dsmCIrd.png', logo_large='https://imgur.com/dsmCIrd.png', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='NYG', name='Giants', logo_small='https://imgur.com/h27yDmv.png', logo_large='https://imgur.com/h27yDmv.png', season_wins=1, season_losses=3, home_wins=0, home_losses=2, away_wins=1, away_losses=1),
        Team(city='NYJ', name='Jets', logo_small='https://imgur.com/nbA5I4x.png', logo_large='https://imgur.com/nbA5I4x.png', season_wins=1, season_losses=3, home_wins=1, home_losses=2, away_wins=0, away_losses=1),
        Team(city='PHI', name='Eagles', logo_small='https://imgur.com/CE2J50g.png', logo_large='https://imgur.com/CE2J50g.png', season_wins=4, season_losses=0, home_wins=2, home_losses=0, away_wins=2, away_losses=0),
        Team(city='PIT', name='Steelers', logo_small='https://imgur.com/PQ9eOdr.png', logo_large='https://imgur.com/PQ9eOdr.png', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
        Team(city='SEA', name='Seahawks', logo_small='https://imgur.com/Vbobr8P.png', logo_large='https://imgur.com/Vbobr8P.png', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='TB', name='Buccaneers', logo_small='https://imgur.com/UuZsw4T.png', logo_large='https://imgur.com/UuZsw4T.png', season_wins=3, season_losses=1, home_wins=1, home_losses=1, away_wins=2, away_losses=0),
        Team(city='TEN', name='Titans', logo_small='https://imgur.com/B5Spd6k.png', logo_large='https://imgur.com/B5Spd6k.png', season_wins=2, season_losses=2, home_wins=2, home_losses=0, away_wins=0, away_losses=2),
        Team(city='WAS', name='Commanders', logo_small='https://imgur.com/KwSseyU.png', logo_large='https://imgur.com/KwSseyU.png', season_wins=2, season_losses=2, home_wins=1, home_losses=1, away_wins=1, away_losses=1),
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
