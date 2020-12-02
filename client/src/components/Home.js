import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import AuthenticatedApp from './AuthenticatedApp/AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp/UnauthenticatedApp';

function Home() {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default Home;