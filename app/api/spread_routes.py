from flask import Blueprint, jsonify, request
from app.models import db, Spread_Bet, User, Week, Game
from flask_login import current_user, login_required

spread_routes = Blueprint('spread_bets', __name__)


@spread_routes.route('')
@login_required
def user_spread_bets():
    """
    Query for all user spread bets and return them in a list of bet dictionaries.
    """
    user_id = int(current_user.get_id())
    try:
        spread_bets = Spread_Bet.query.filter_by(user_id=user_id).all()
        return jsonify({'user_spread_bets': [bet.to_dict() for bet in spread_bets]})
    except Exception as e:
        return jsonify({'error': 'Error fetching user spread bets', 'details': str(e)})


@spread_routes.route('', methods=['POST'])
@login_required
def post_spread_bet():
    """
    Make a spread bet as a logged-in user.
    """
    try:
        ## gameId, status, betAmount, payout, week
        print('ENTERED SPREAD BET POST ROUTE!!!!!')
        spread_bet_data = request.get_json()
        print('SPREAD BET DATA!!! ~~~~ ', spread_bet_data)
        user_id = int(current_user.get_id())

        user = User.query.get(user_id)


        new_spread_bet = Spread_Bet(
            user_id=user_id,
            week=spread_bet_data['week'],
            game_id=spread_bet_data['gameId'],
            selected_team_name = spread_bet_data['teamName'],
            spread_at_bet = spread_bet_data['spread'],
            progs_wagered=spread_bet_data['betAmount'],
        )
        user.prognosticoins -= spread_bet_data['betAmount']
        db.session.add(new_spread_bet)
        db.session.commit()

        return {"Success": "Spread bet creation success"}
    except Exception as e:
        print(str(e))
        return {"Error": "An error occurred while processing the bet"}

@spread_routes.route('/check')
@login_required
def check_spread_bets():
    current_week = Week.query.first().current_week
    try:
        current_spread_bets = Spread_Bet.query.filter_by(week=current_week).all()
        print('CURRENT WEEK SPREAD BETS ------------- ', current_spread_bets)
        TEAM_ABBREVIATIONS = {
            'ARI': 'Cardinals',
            'ATL': 'Falcons',
            'BAL': 'Ravens',
            'BUF': 'Bills',
            'CAR': 'Panthers',
            'CHI': 'Bears',
            'CIN': 'Bengals',
            'CLE': 'Browns',
            'DAL': 'Cowboys',
            'DEN': 'Broncos',
            'DET': 'Lions',
            'GB': 'Packers',
            'HOU': 'Texans',
            'IND': 'Colts',
            'JAX': 'Jaguars',
            'KC': 'Chiefs',
            'LV': 'Raiders',
            'LAC': 'Chargers',
            'LAR': 'Rams',
            'MIA': 'Dolphins',
            'MIN': 'Vikings',
            'NE': 'Patriots',
            'NO': 'Saints',
            'NYG': 'Giants',
            'NYJ': 'Jets',
            'PHI': 'Eagles',
            'PIT': 'Steelers',
            'SF': '49ers',
            'SEA': 'Seahawks',
            'TB': 'Buccaneers',
            'TEN': 'Titans',
            'WAS': 'Commanders',
        }

        if not current_spread_bets:
            return jsonify({'message': 'No spread bets found for the current week'})

        for current_bet in current_spread_bets:
            if current_bet.status in ('WIN', 'LOSS', 'PUSH'):
                continue
            game = Game.query.get(current_bet.game_id)
            bet_user = User.query.get(current_bet.user_id)
            if game.completed:
                spread_at_bet = current_bet.spread_at_bet
                if spread_at_bet == 'EVEN':
                    home_team = game.home_team_name
                    away_team = game.away_team_name
                    home_score = game.home_team_score
                    away_score = game.away_team_score
                    if home_score == away_score:
                        current_bet.status = 'PUSH'
                        bet_user.prognosticoins += current_bet.progs_wagered
                    elif home_score > away_score:
                        current_bet.status = 'WIN' if current_bet.selected_team_name == home_team else 'LOSS'
                        if current_bet.status == 'WIN':
                            bet_user.prognosticoins += (current_bet.progs_wagered + (current_bet.progs_wagered / 1.1))
                    else:
                        current_bet.status = 'WIN' if current_bet.selected_team_name == away_team else 'LOSS'
                        if current_bet.status == 'WIN':
                            bet_user.prognosticoins += (current_bet.progs_wagered + (current_bet.progs_wagered / 1.1))
                else:
                    team_abbrev, spread_value = spread_at_bet.split(' -')
                    favored_team = TEAM_ABBREVIATIONS.get(team_abbrev)
                    print('FAVORED TEAM WORKING CORRECTLY!!!! THIS MAY BE THE PROBLEM!!! ', favored_team)
                    print('SPREAD VALUE AFTER SPLIT~~~~~~~~ ', spread_value)
                    print('TEAM ABBREV SPLIT FROM SPREAD, for some reason GREYED OUT/NOT IN USE---- ', team_abbrev)
                    if favored_team is None:
                        continue

                    home_team = game.home_team_name
                    away_team = game.away_team_name
                    home_score = game.home_team_score
                    away_score = game.away_team_score

                    if home_team == favored_team:
                        spread_diff = home_score - away_score
                    else:
                        spread_diff = away_score - home_score

                    if spread_diff > float(spread_value):
                        current_bet.status = 'WIN' if current_bet.selected_team_name == home_team else 'LOSS'
                        if current_bet.status == 'WIN':
                            bet_user.prognosticoins += (current_bet.progs_wagered + (current_bet.progs_wagered / 1.1))
                    elif spread_diff < -float(spread_value):
                        current_bet.status = 'WIN' if current_bet.selected_team_name == away_team else 'LOSS'
                        if current_bet.status == 'WIN':
                            bet_user.prognosticoins += (current_bet.progs_wagered + (current_bet.progs_wagered / 1.1))
                    else:
                        current_bet.status = 'PUSH'
                        bet_user.prognosticoins += current_bet.progs_wagered
        db.session.commit()
        return jsonify({'message': 'All Spread Bets for the current week updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Error checking Spread Bets', 'details': str(e)})
