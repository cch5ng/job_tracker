import React, { useState } from 'react';

const AuthContext = React.createContext([{}, () => {}]);
function AuthProvider({children}) {
  const [state, setState] = React.useState({
    userEmail: null,
    userGuid: null,
    sessionToken: null
  });

  const login = ({userEmail, sessionToken}) => {
    setState({...state, userEmail, sessionToken});
  }

  const logout = () => {
    setState({
      userEmail: null,
      userGuid: null,
      sessionToken: null
    });
  }

  const getUserGuid = ({userEmail}) => {
    //make api request
    fetch('http://localhost:3000/api/auth/guid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: userEmail})
    })
      .then(resp => resp.json())
      .then(json => {
        let userGuid = json.user_guid;
        setState({...state, userGuid});
      })
      .catch(err => console.error('err', err))        
  }

  let authState = {...state, logout, getUserGuid, login};

  /**
   * Provider component is the place where you'd pass a prop called value to, 
   * which you can subsequently consume within the Consumer component
   */
  return (
    <AuthContext.Provider value={authState}>
      {state.status === 'pending' ? (
        'Loading...'
      ) : state.status === 'logged out' ? (
        children
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

//this seems simpler method to pass functions from context to consumers
function useAppAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context;
}

export {AuthProvider, useAppAuth};