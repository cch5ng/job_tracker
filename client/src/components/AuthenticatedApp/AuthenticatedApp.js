import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {useAppAuth} from '../../context/auth-context';
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
import {JobsProvider, useJobs} from '../../context/jobs-context';

const AuthenticatedApp = () => {
  const {login, getUserGuid, userGuid, userEmail, sessionToken} = useAppAuth();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const {getJobsForUser} = useJobs();
  const { name, picture, email } = user;

  // const getTokenAndStore = async (userGuid) => {
  //   const token = await getAccessTokenSilently();
  //   login({userEmail: email, sessionToken: token, userGuid})

  //   let url;
  //   if (userGuid) {
  //     url = `http://localhost:3000/api/jobs/all/${userGuid}`;
  //   } 
  //   if (url && token) {
  //     getJobsForUser({url, token})
  //   }
  // }

  // useEffect(() => {
  //   getUserGuid({userEmail: email})
  //     .then(uGuid => {
  //       getTokenAndStore(uGuid);
  //     })
  // }, [])

  return (
    <div>
      <AuthenticatedNavBar />
      <main className="main">
        {/* <JobsProvider> */}
          <Switch>
            {/* <Route path="/" exact component={Home} /> */}
            <ProtectedRoute path="/profile" component={Profile} />
            <ProtectedRoute path="/external-api" component={ExternalApi} />
            <ProtectedRoute exact path="/jobs/new" component={JobsFormCreate} />
            <ProtectedRoute exact path="/jobs/:jobId/events" component={Events} />
            <ProtectedRoute exact path="/jobs/:jobId" component={JobsFormEdit} />
            <ProtectedRoute exact path="/events/new/:jobId" component={EventsFormCreate} />
            <ProtectedRoute exact path="/events/edit/:eventId" component={EventsFormEdit} />
              <ProtectedRoute path="/jobs" component={Jobs} />
              <ProtectedRoute exact path="/events" component={Events} />
          </Switch>
        {/* </JobsProvider> */}
      </main>
    </div>
    )
}

export default AuthenticatedApp;