import { Link } from 'react-router-dom';
import './splashPage.css'

function SplashPage() {


    return (
        <>
        <div className='splash-overall-div'>
          <div className='splash-welcome-div'>
            <h2>Welcome to Prognosticate or Perish</h2>
            <h5>Casual NFL predictive games for friends and family!</h5>
            <div className='splash-gamelist-div'>
              <ul className='splash-gamelist-ul'>
                <li className='splash-gamelist-li'>
                  <span className='splash-gamelist-title'>
                    <Link to='/eliminator'>Eliminator</Link>
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
                    Use a set amount of prognosticoins to out-bet your competition and earn the most prognosticoins!
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
                    Use a set amount of prognosticoins to out-bet your competition and earn the most prognosticoins!
                  </span>
                  <span className='splash-gamelist-status'>
                  Coming Soon
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </>
      );
}

export default SplashPage;
