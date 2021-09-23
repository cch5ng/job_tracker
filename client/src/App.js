import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState} from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { useAuth0 } from "@auth0/auth0-react";

import {AuthProvider} from './context/auth-context';
import {JobsProvider} from './context/jobs-context';
import {CompanyProvider} from './context/company-context';
import {AlertProvider} from './context/alert-context';
import Home from './components/Home';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_WEB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_WEB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_WEB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_WEB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_WEB_APP_ID
};
const app = initializeApp(firebaseConfig);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <AuthProvider>
        <AlertProvider value={this.state}>
          <JobsProvider>
            <CompanyProvider>
              <div id="app" className="d-flex flex-column h-100">
                <Home />
              </div>
            </CompanyProvider>
          </JobsProvider>
        </AlertProvider>
      </AuthProvider>
    );  
  }
};

export default App;
