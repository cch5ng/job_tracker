import * as React from "react";
import * as ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const audience = 'http://localhost:3000';
//`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`;

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const redirectUri = `${process.env.REACT_APP_AUTH0_AUDIENCE}/events`

ReactDOM.render(
  <Router>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={redirectUri}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Auth0Provider>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
