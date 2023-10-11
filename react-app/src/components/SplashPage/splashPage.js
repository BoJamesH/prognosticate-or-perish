import { Link } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CommentForm from '../CommentForm/commentForm';
import CommentList from '../CommentList/commentList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './splashPage.css'

function SplashPage() {
    const sessionUser = useSelector(state => state.session.user)
    const [showMenu, setShowMenu] = useState(false);
    const [showButtons, setShowButtons] = useState(true)
    console.log('SESSION USER--- ', sessionUser)
    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        if (sessionUser) {
            setShowButtons(false)
        }
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
                      Pick 'Em
                    </span>
                    <span className='splash-gamelist-description'>
                      Pick ALL the games each week, the player with the best record wins.
                    </span>
                    <span className='splash-gamelist-status'>
                      Coming Soon
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                      Spread Eliminator
                    </span>
                    <span className='splash-gamelist-description'>
                      Same as eliminator, but this time you have to beat the spread. That's harder!
                    </span>
                    <span className='splash-gamelist-status'>
                      Coming Soon
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                      Spread Bets
                    </span>
                    <span className='splash-gamelist-description'>
                      Use a set amount of prognosticoins to out-bet your competition and earn the most by the end of the season betting against the spread!
                    </span>
                    <span className='splash-gamelist-status'>
                      Coming Soon
                    </span>
                  </li>
                  <li className='splash-gamelist-li'>
                    <span className='splash-gamelist-title'>
                      Over/Under Bets
                    </span>
                    <span className='splash-gamelist-description'>
                      Use a set amount of prognosticoins to out-bet your competition and earn the most by the end of the season betting on the over/under!
                    </span>
                    <span className='splash-gamelist-status'>
                      Coming Soon
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {sessionUser && (
                <>
                <div className='main-commentform-div'>
                <CommentForm />
              </div>
              <div className='main-commentlist-div'>
                <CommentList />
              </div>
                </>
            )}
          </div>
        </>
      );

}

export default SplashPage;
