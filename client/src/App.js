import {useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {AuthProvider} from './context/auth-context';
import Home from './components/Home';
// import Login from './components/Login';
// import Logout from './components/Logout';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <AuthProvider>
      <div id="app" className="d-flex flex-column h-100">
        <Home />
        {/* <Footer /> */}
      </div>
    </AuthProvider>
  );
};

export default App;
