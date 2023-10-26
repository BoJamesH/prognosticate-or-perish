"""empty message

Revision ID: 472ea0f36098
Revises:
Create Date: 2023-10-09 13:20:06.241413

"""
from alembic import op
import sqlalchemy as sa
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '472ea0f36098'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('profile_image', sa.String(length=1000), nullable=True),
    sa.Column('prognosticoins', sa.Integer(), nullable=True),
    sa.Column('pick_wins', sa.Integer(), nullable=True),
    sa.Column('pick_losses', sa.Integer(), nullable=True),
    sa.Column('pick_ties', sa.Integer(), nullable=True),
    sa.Column('elim_wins', sa.Integer(), nullable=True),
    sa.Column('elim_losses', sa.Integer(), nullable=True),
    sa.Column('elim_ties', sa.Integer(), nullable=True),
    sa.Column('sp_elim_wins', sa.Integer(), nullable=True),
    sa.Column('sp_elim_losses', sa.Integer(), nullable=True),
    sa.Column('sp_elim_pushes', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")

    op.create_table('games',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('espn_id', sa.Integer(), nullable=True),
    sa.Column('week', sa.Integer(), nullable=True),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('home_team_name', sa.String(), nullable=True),
    sa.Column('away_team_name', sa.String(), nullable=True),
    sa.Column('home_team_score', sa.Integer(), nullable=True),
    sa.Column('away_team_score', sa.Integer(), nullable=True),
    sa.Column('spread', sa.String(), nullable=True),
    sa.Column('over_under', sa.Integer(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE games SET SCHEMA {SCHEMA};")

    op.create_table('last_fetch',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_fetch_timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE last_fetch SET SCHEMA {SCHEMA};")

    op.create_table('teams',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('city', sa.String(length=50), nullable=True),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('logo_small', sa.String(), nullable=True),
    sa.Column('logo_large', sa.String(), nullable=True),
    sa.Column('season_wins', sa.Integer(), nullable=True),
    sa.Column('season_losses', sa.Integer(), nullable=True),
    sa.Column('home_wins', sa.Integer(), nullable=True),
    sa.Column('home_losses', sa.Integer(), nullable=True),
    sa.Column('away_wins', sa.Integer(), nullable=True),
    sa.Column('away_losses', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('city'),
    sa.UniqueConstraint('name')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE teams SET SCHEMA {SCHEMA};")

    op.create_table('weeks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('current_week', sa.Integer(), nullable=True),
    sa.Column('current_year', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE weeks SET SCHEMA {SCHEMA};")

    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('user_username', sa.String(length=40), nullable=True),
    sa.Column('user_profile_image', sa.String(), nullable=True),
    sa.Column('comment_text', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE comments SET SCHEMA {SCHEMA};")

    op.create_table('elim_picks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('week', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('selected_team_name', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE elim_picks SET SCHEMA {SCHEMA};")

    op.create_table('over_under_bets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('week', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('selected_team_name', sa.String(), nullable=True),
    sa.Column('progs_wagered', sa.Integer(), nullable=True),
    sa.Column('payout', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE over_under_bets SET SCHEMA {SCHEMA};")

    op.create_table('pickem_picks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('week', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('selected_team_name', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE pickem_picks SET SCHEMA {SCHEMA};")

    op.create_table('results',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('home_score', sa.Integer(), nullable=False),
    sa.Column('away_score', sa.Integer(), nullable=False),
    sa.Column('total_points', sa.Integer(), nullable=False),
    sa.Column('winner_name', sa.String(), nullable=True),
    sa.Column('loser_name', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE results SET SCHEMA {SCHEMA};")

    op.create_table('spread_elim_picks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('week', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('selected_team_name', sa.String(), nullable=True),
    sa.Column('spread_at_bet', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE spread_elim_picks SET SCHEMA {SCHEMA};")

    op.create_table('spread_bets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('week', sa.Integer(), nullable=True),
    sa.Column('game_id', sa.Integer(), nullable=True),
    sa.Column('selected_team_name', sa.String(), nullable=True),
    sa.Column('spread_at_bet', sa.String(), nullable=True),
    sa.Column('progs_wagered', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['game_id'], ['games.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE spread_bets SET SCHEMA {SCHEMA};")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('spread_bets')
    op.drop_table('spread_elim_picks')
    op.drop_table('results')
    op.drop_table('pickem_picks')
    op.drop_table('over_under_bets')
    op.drop_table('elim_picks')
    op.drop_table('comments')
    op.drop_table('weeks')
    op.drop_table('teams')
    op.drop_table('last_fetch')
    op.drop_table('games')
    op.drop_table('users')
    # ### end Alembic commands ###
