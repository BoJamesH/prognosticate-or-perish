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
          <Route exact path='/'>
            <UserPage />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
