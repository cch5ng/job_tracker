import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import AuthenticatedNavBar from "../Header/AuthenticatedNavBar"; //, Footer, Loading 
import Profile from '../Profile';
import ProtectedRoute from "../../auth/ProtectedRoute";
import ExternalApi from '../../views/ExternalApi';
import Jobs from '../Jobs/Jobs';
import JobsFormCreate from '../Jobs/JobsFormCreate';
import JobsFormEdit from '../Jobs/JobsFormEdit';
import EventsFormCreate from '../Events/EventsFormCreate';
import EventsFormEdit from '../Events/EventsFormEdit';
import Events from '../Events/Events';

const AuthenticatedApp = () => {
  return (
    <div>
      <AuthenticatedNavBar />
      <main className="main">
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
          <ProtectedRoute exact path="/jobs/new" component={JobsFormCreate} />
          <ProtectedRoute exact path="/jobs/:jobId/events" component={Events} />
          <ProtectedRoute exact path="/jobs/:jobId" component={JobsFormEdit} />
          <ProtectedRoute path="/jobs" component={Jobs} />
          <ProtectedRoute exact path="/events/new/:jobId" component={EventsFormCreate} />
          <ProtectedRoute exact path="/events/edit/:eventId" component={EventsFormEdit} />
          <ProtectedRoute exact path="/events" component={Events} />
        </Switch>
      </main>
    </div>
    )
}

export default AuthenticatedApp;