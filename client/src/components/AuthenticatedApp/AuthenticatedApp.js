import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import AuthenticatedNavBar from "../Header/AuthenticatedNavBar";
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
  const [showNavMenu, setShowNavMenu] = useState(false);

  const toggleNavMenuDisplay = (ev) => {
    if (ev.target.className === 'main' && showNavMenu) {
      setShowNavMenu(!showNavMenu);
    } else {
      setShowNavMenu(!showNavMenu);
    }
  }

  return (
    <div>
      <AuthenticatedNavBar showNavMenu={showNavMenu} toggleNavMenuDisplay={toggleNavMenuDisplay} />
      <main className="main" onClick={toggleNavMenuDisplay}>
        <Switch>
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
          <ProtectedRoute exact path="/jobs/new" component={JobsFormCreate} />
          <ProtectedRoute exact path="/jobs/:jobId/events" component={Events} />
          <ProtectedRoute exact path="/jobs/:jobId" component={JobsFormEdit} />
          <ProtectedRoute exact path="/jobs" component={Jobs} />
          <ProtectedRoute exact path="/events/new/:jobId" component={EventsFormCreate} />
          <ProtectedRoute exact path="/events/edit/:eventId" component={EventsFormEdit} />
          <ProtectedRoute exact path="/events" component={Events} />
        </Switch>
      </main>
    </div>
    )
}

export default AuthenticatedApp;