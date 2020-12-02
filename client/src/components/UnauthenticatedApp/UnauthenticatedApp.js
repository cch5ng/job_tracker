import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LoginButton from "../LoginButton";

const UnauthenticatedApp = () => {
  return (
    <div>
      <LoginButton />
    </div>
  )
}

export default UnauthenticatedApp