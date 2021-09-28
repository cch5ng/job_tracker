import React from 'react';
import AuthenticatedApp from './AuthenticatedApp/AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp/UnauthenticatedApp';
import {useAuth} from '../context/auth-context';

function Home() {
  const {status} = useAuth();
  return status === 'logged in' ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default Home;