import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LoginButton from "../Header/LoginButton";
import UnauthenticatedNavBar from '../Header/UnauthenticatedNavBar';

const UnauthenticatedApp = () => {
  return (
    <div>
      <UnauthenticatedNavBar />
      <LoginButton />
    </div>
  )
}

export default UnauthenticatedApp