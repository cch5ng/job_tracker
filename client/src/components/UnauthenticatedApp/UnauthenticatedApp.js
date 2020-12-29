import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LoginButton from "../Header/LoginButton";
import UnauthenticatedNavBar from '../Header/UnauthenticatedNavBar';
import styles from './UnauthenticatedApp.module.css';
import splashScreen from '../..//daoud-abismail-unsplash.jpg';

const UnauthenticatedApp = () => {
  return (
    <div>
      <UnauthenticatedNavBar />
      <main>
        <div className={styles.splash_screen_container} >
          <img src={splashScreen} className={styles.splash_screen} />
          <LoginButton />
        </div>
      </main>
    </div>
  )
}

export default UnauthenticatedApp