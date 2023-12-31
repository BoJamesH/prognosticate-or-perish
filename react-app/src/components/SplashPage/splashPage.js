import { Link } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import CommentListGuest from '../CommentListGuest/commentListGuest';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './splashPage.css'
import { checkUserElimPicks } from '../../store/elimPicks';
import { checkUserPickEmPicks } from '../../store/pickEmPicks';
import { checkUserOverUnderBets } from '../../store/overUnderBets';
import { checkUserSpreadElimPicks } from '../../store/spreadElimPicks';

function SplashPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [showMenu, setShowMenu] = useState(false);
    const [showButtons, setShowButtons] = useState(true)
    console.log('SESSION USER--- ', sessionUser)
    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        if (sessionUser) {
            setShowButtons(false)
        }
        dispatch(checkUserElimPicks())
        dispatch(checkUserPickEmPicks())
        dispatch(checkUserOverUnderBets())
        dispatch(checkUserSpreadElimPicks())
    }, [sessionUser])

    return (
        <>
          <div className='splash-overall-div'>
            <div className='splash-welcome-div'>
              <h2>Welcome to <span className='splash-title'>Prognosticate or Perish</span></h2>
              <h5>Casual NFL predictive games for friends and family!</h5>
              {!sessionUser ? (
                <>
                  <OpenModalButton
                    buttonText="Log In"
                    className='splash-login-button'
                    onItemClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                  />

                  <OpenModalButton
                    buttonText="Sign Up"
                    onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                  />
                </>
              ) : null}
              <div className='splash-gamelist-div'>
                <ul className='splash-gamelist-ul'>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                      <Link className='splash-game-link' to='/eliminator'>Eliminator</Link>
                    </span>
                    <span className='splash-gamelist-description'>
                      Choose one team each week (no repeats). If they win, so do you. Best record at the end of the season wins.
                    </span>
                    <span className='splash-gamelist-status'>
                      Open!
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                  <span className='splash-gamelist-title'>
                      <Link className='splash-game-link' to='/pickem'>Pick 'Em</Link>
                    </span>
                    <span className='splash-gamelist-description'>
                      Pick ALL the games each week, the player with the best record wins.
                    </span>
                    <span className='splash-gamelist-status'>
                      Open!
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                    <Link className='splash-game-link' to='/sp-eliminator'>Spread Eliminator</Link>
                    </span>
                    <span className='splash-gamelist-description'>
                      Same as eliminator, but this time you have to beat the spread. That's harder!
                    </span>
                    <span className='splash-gamelist-status'>
                      Open!
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                    <Link className='splash-game-link' to='/spread'>Spread Bets</Link>
                    </span>
                    <span className='splash-gamelist-description'>
                      Use a set amount of prognosticoins to out-bet your competition and earn the most by the end of the season betting against the spread!
                    </span>
                    <span className='splash-gamelist-status'>
                      Open!
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                    <Link className='splash-game-link' to='/overunder'>Over/Under Bets</Link>
                    </span>
                    <span className='splash-gamelist-description'>
                      Use a set amount of prognosticoins to out-bet your competition and earn the most by the end of the season wagering on the over/under!
                    </span>
                    <span className='splash-gamelist-status'>
                      Open!
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {sessionUser ? (
                <>
                <div className='main-commentform-div'>
                <CommentForm />
              </div>
              <div className='main-commentlist-div'>
                <CommentList />
              </div>
                </>
            ):
            <CommentListGuest />}
          </div>
        </>
      );

}

export default SplashPage;
