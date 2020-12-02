import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
//import {Route, Switch} from 'react-router-dom';
import NavBar from "../NavBar"; //, Footer, Loading 
import Profile from '../Profile';
import ProtectedRoute from "../../auth/ProtectedRoute";
import ExternalApi from '../../views/ExternalApi';
import Jobs from '../Jobs';
//import { useAuth } from '../../context/auth-context';

const AuthenticatedApp = () => {
  return (
    <div>
      <NavBar />
      <div className="container flex-grow-1">
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
          <ProtectedRoute path="/jobs" component={Jobs} />
        </Switch>
      </div>
    </div>
    )
}

export default AuthenticatedApp;