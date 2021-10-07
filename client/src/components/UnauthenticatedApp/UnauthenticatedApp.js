import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import UnauthenticatedNavBar from '../Header/UnauthenticatedNavBar';
import styles from './UnauthenticatedApp.module.css';
import splashScreen from '../..//daoud-abismail-unsplash.jpg';
import Signup from '../Signup/Signup';
import Login from '../Login/Login';

const UnauthenticatedApp = () => {
  return (
    <div>
      <UnauthenticatedNavBar />
      <main>
        <Switch>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <div className={styles.splash_screen_container} >
              <img src={splashScreen} className={styles.splash_screen} />
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  )
}

export default UnauthenticatedApp