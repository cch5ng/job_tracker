import * as React from "react";
import * as ReactDOM from "react-dom";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import {BrowserRouter as Router} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const audience = 'http://localhost:3000';
//`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`;

ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
