import {useState, useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function Jobs() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { name, picture, email } = user;

  console.log('email', email)
  console.log('isAuthenticated', isAuthenticated)

  return (
    <div>
      <h1>JOBS TODO</h1>
    </div>
  );
};

export default Jobs;