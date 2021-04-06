import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {AuthProvider} from './context/auth-context';
import {JobsProvider} from './context/jobs-context';
import {CompanyProvider} from './context/company-context';
import {AlertProvider} from './context/alert-context';
import Home from './components/Home';

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
