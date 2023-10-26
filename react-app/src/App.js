import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import EliminatorPage from "./components/Eliminator/eliminator";
import UserPage from "./components/UserPage/userPage";
import Footer from "./components/SiteFooter/siteFooter";
import SplashPage from "./components/SplashPage/splashPage";
import PickEmPage from "./components/PickEm/pickEm";
import LeaderboardPage from "./components/Leaderboards/leaderboards";
import OverUnderPage from "./components/OverUnder/overUnder";
import SpreadEliminatorPage from "./components/SpreadEliminator/spreadEliminator";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path='/eliminator'>
            <EliminatorPage />
          </Route>
          <Route exact path='/sp-eliminator'>
            <SpreadEliminatorPage />
          </Route>
          <Route exact path='/pickem'>
            <PickEmPage />
          </Route>
          <Route path="/overunder">
            <OverUnderPage />
          </Route>
          <Route exact path='/user'>
            <UserPage />
          </Route>
          <Route exact path='/leaderboard'>
            <LeaderboardPage />
          </Route>
          <Route exact path='/'>
            <SplashPage />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
