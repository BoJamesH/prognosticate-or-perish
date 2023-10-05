from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo1 = User(
        username='Demo1', email='demo1@aa.io', password='password', profile_image='https://i.natgeofe.com/k/63b1a8a7-0081-493e-8b53-81d01261ab5d/red-panda-full-body_3x4.jpg')
    demo2 = User(
        username='Demo2', email='demo2@aa.io', password='password', profile_image='https://images.unsplash.com/photo-1566650554919-44ec6bbe2518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwYW5pbWFsfGVufDB8fDB8fHww&w=1000&q=80')
    bo = User(
        username='Bo', email='bo@aa.io', password='password', profile_image='https://i.imgur.com/FVynsKb.jpg')
    ben = User(
        username='Ben', email='ben@aa.io', password='password', profile_image='https://imageio.forbes.com/specials-images/imageserve/5faad4255239c9448d6c7bcd/0x0.jpg?format=jpg&width=1200')
    devon = User(
        username='Devon', email='devon@aa.io', password='password', profile_image='https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
    brian = User(
        username='Brian', email='brian@aa.io', password='password', profile_image='https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')

    db.session.add(demo1)
    db.session.add(demo2)
    db.session.add(bo)
    db.session.add(ben)
    db.session.add(devon)
    db.session.add(brian)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
