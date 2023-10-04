from flask.cli import AppGroup
from .users import seed_users, undo_users
from .teams import seed_teams, undo_teams
from .games import seed_games, undo_games
from .comments import seed_comments, undo_comments
from .elim_picks import seed_elim_picks, undo_elim_picks

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
            undo_users()
    seed_users()
    seed_teams()
    seed_games()
    seed_comments()
    seed_elim_picks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_elim_picks()
    undo_comments()
    undo_games()
    undo_teams()
    undo_users()
    # Add other undo functions here
