import {useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
// import Login from './components/Login';
// import Logout from './components/Logout';

function App() {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="App">
      <h1>hello oauth test</h1>
      {!isAuthenticated && (
        <LoginButton />
      )}
      <Profile />
      {isAuthenticated && (
        <LogoutButton />
      )}
    </div>
  );
}

export default App;
