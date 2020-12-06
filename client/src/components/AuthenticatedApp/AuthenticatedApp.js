import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import NavBar from "../NavBar"; //, Footer, Loading 
import Profile from '../Profile';
import ProtectedRoute from "../../auth/ProtectedRoute";
import ExternalApi from '../../views/ExternalApi';
import Jobs from '../Jobs/Jobs';
import JobsFormCreate from '../Jobs/JobsFormCreate';
import JobsFormEdit from '../Jobs/JobsFormEdit';

const AuthenticatedApp = () => {
  return (
    <div>
      <NavBar />
      <div className="container flex-grow-1">
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
          <ProtectedRoute exact path="/jobs/new" component={JobsFormCreate} />
          <ProtectedRoute exact path="/jobs/:jobId" component={JobsFormEdit} />
          <ProtectedRoute path="/jobs" component={Jobs} />
          <ProtectedRoute exact path="/events/new/:jobId" component={EventsFormCreate} />
          <ProtectedRoute exact path="/events/:eventId" component={EventsFormEdit} />
        </Switch>
      </div>
    </div>
    )
}

export default AuthenticatedApp;