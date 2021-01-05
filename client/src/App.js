import {useState} from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import {AuthProvider} from './context/auth-context';
import {JobsProvider} from './context/jobs-context';
import Home from './components/Home';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <AuthProvider>
      <JobsProvider>
        <div id="app" className="d-flex flex-column h-100">
          <Home />
        </div>
      </JobsProvider>
    </AuthProvider>
  );
};

export default App;
