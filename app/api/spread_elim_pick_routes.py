from flask import Blueprint, jsonify, request
from app.models import db, Spread_Elim_Pick, Week, Game, User
from flask_login import current_user, login_required

spread_elim_pick_routes = Blueprint('spread_elim_picks', __name__)


@spread_elim_pick_routes.route('')
@login_required
def user_spread_elim_picks():
    """
    Query for all user spread eliminator picks and return them in a list of pick dictionaries.
    """
    user_id = int(current_user.get_id())
    try:
        print('INSIDE TRY BLOCK OF GET USER ELIM PICKS')
        picks = Spread_Elim_Pick.query.filter_by(user_id=user_id).all()
        print('PICKS ON BACKEND!!!! ', picks)
        print('JSONIFIED BACKEND SPREAD PICK EM PICKS', jsonify({'user_spread_elim_picks': [pick.to_dict() for pick in picks]}))
        return jsonify({'user_spread_elim_picks': [pick.to_dict() for pick in picks]})
    except Exception as e:
        return jsonify({'error': 'Error fetching user picks', 'details': str(e)})


@spread_elim_pick_routes.route('', methods=['POST'])
@login_required
def post_spread_elim_pick():
    """
    Select a spread eliminator pick as a logged-in user.
    """
    try:
        spread_elim_pick_data = request.get_json()
        user_id = int(current_user.get_id())
        week = spread_elim_pick_data.get('week')
        existing_pick = Spread_Elim_Pick.query.filter_by(user_id=user_id, week=week).first()
        if existing_pick:
            existing_pick.game_id = spread_elim_pick_data['gameId']
            existing_pick.selected_team_name = spread_elim_pick_data['name']
            existing_pick.spread_at_bet = spread_elim_pick_data['spread']
            db.session.commit()
            return {"Success": "Pick update success"}
        else:
            # Create a new Elim_Pick record
            fresh_pick = Spread_Elim_Pick(
                user_id=user_id,
                week = spread_elim_pick_data['week'],
                game_id = spread_elim_pick_data['gameId'],
                selected_team_name = spread_elim_pick_data['name'],
                spread_at_bet = spread_elim_pick_data['spread']
            )
            db.session.add(fresh_pick)
            db.session.commit()
            return {"Success": "Pick creation success"}
    except Exception as e:
        return jsonify({'error': 'Error posting pick', 'details': str(e)})


# @comment_routes.route('/<comment_id>', methods=['DELETE'])
# @login_required
# def delete_comment(comment_id):
#     """
#     Delete a comment by the owner of the comment
#     """
#     try:
#         comment_to_delete = Comment.query.get(comment_id)
#         db.session.delete(comment_to_delete)
#         db.session.commit()
#         return {'Success': 'Comment deleted'}
#     except Exception as e:
#         return jsonify({'error': 'Error deleting comment', 'details': str(e)})

@spread_elim_pick_routes.route('/<int:week>', methods=['DELETE'])
@login_required
def delete_spread_elim_pick(week):
    """
    Delete the spread eliminator pick of the current user for the specified week.
    """
    user_id = int(current_user.get_id())
    try:
        pick = Spread_Elim_Pick.query.filter_by(user_id=user_id, week=week).first()
        if pick:
            db.session.delete(pick)
            db.session.commit()
            return jsonify({'message': 'Spread eliminator pick deleted successfully'})
        else:
            return jsonify({'message': 'Spread eliminator pick not found for the specified week'})
    except Exception as e:
        return jsonify({'error': 'Error deleting user pick', 'details': str(e)})


@spread_elim_pick_routes.route('/check')
@login_required
def check_spread_eliminator_picks():
    current_week = Week.query.first().current_week
    try:
        current_picks = Spread_Elim_Pick.query.filter_by(week=current_week).all()
        print('ALL CURRENT WEEK PICKS!!! ', current_picks)
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
        # print('TEAM ABBREVIATION OBJECT CHECK!!!! ', TEAM_ABBREVIATIONS)

        if not current_picks:
            return jsonify({'message': 'No spread eliminator picks found for the current week'})

        for current_pick in current_picks:
            if current_pick.status in ('WIN', 'LOSS', 'TIE'):
                continue

            game = Game.query.get(current_pick.game_id)
            pick_user = User.query.get(current_pick.user_id)

            if game.completed:
                spread_at_bet = current_pick.spread_at_bet
                print('ENTERED GAME COMPLETED ROUTE!!!')
                # Check for 'EVEN' spread
                if spread_at_bet == 'EVEN':
                    home_team = game.home_team_name
                    away_team = game.away_team_name
                    home_score = game.home_team_score
                    away_score = game.away_team_score
                    print('ELEMENTS FROM EVEN SPREAD----- ', home_team, away_team, home_score, away_score)
                    if home_score == away_score:
                        current_pick.status = 'PUSH'
                        pick_user.sp_elim_ties += 1
                    elif home_score > away_score:
                        current_pick.status = 'WIN' if current_pick.selected_team_name == home_team else 'LOSS'
                        if current_pick.status == 'WIN':
                            pick_user.sp_elim_wins += 1
                        else:
                            pick_user.sp_elim_losses += 1
                    else:
                        current_pick.status = 'WIN' if current_pick.selected_team_name == away_team else 'LOSS'
                        if current_pick.status == 'WIN':
                            pick_user.sp_elim_wins += 1
                        else:
                            pick_user.sp_elim_losses += 1
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
                        current_pick.status = 'WIN' if current_pick.selected_team_name == home_team else 'LOSS'
                        if current_pick.status == 'WIN':
                            pick_user.sp_elim_wins += 1
                        else:
                            pick_user.sp_elim_losses += 1
                    elif spread_diff < -float(spread_value):
                        current_pick.status = 'WIN' if current_pick.selected_team_name == away_team else 'LOSS'
                        if current_pick.status == 'WIN':
                            pick_user.sp_elim_wins += 1
                        else:
                            pick_user.sp_elim_losses += 1
                    else:
                        current_pick.status = 'TIE'
                        pick_user.sp_elim_ties += 1
                    print('CURRENT PICK STATUS AFTER CHECKING!!!!! ', current_pick.status)
        db.session.commit()

        return jsonify({'message': 'Spread eliminator picks for the current week updated successfully'})
    except Exception as e:
        return jsonify({'error': 'Error updating spread eliminator picks', 'details': str(e)})
