import React, { useState } from 'react';
import { createBrowserHistory } from 'history';

const AuthContext = React.createContext([{}, () => {}]);
function AuthProvider({children}) {
  const [curAuthState, setCurAuthState] = React.useState({
    status: 'logged out',
    error: null,
  });
  const [user, setUser] = useState(null);
  const [userGuid, setUserGuid] = useState('');

  let history = createBrowserHistory();

  const logout = () => {
    localStorage.removeItem('blackjackAuthToken');
    setUser(null);
    setCurAuthState({
      status: 'logged out',
      error: null,
    })
    history.push('/');
  }

  const login = () => {
    setCurAuthState({
      status: 'logged in',
      error: null,
    })
  }

  const setUserGuidReq = ({userEmail}) => {
    //no
    return fetch('http://localhost:3000/api/auth/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: userEmail})
    })
      .then(resp => resp.json())
      .then(json => {
        if (json.user_guid) {
          //yes
          let userGuid = json.user_guid;
          setUserGuid(userGuid);
          login();
          return userGuid;  
        }
      })
  }

  const getUserGuid = ({userEmail}) => {
    //make api request
    //check if the user exists in the db
    return fetch('http://localhost:3000/api/auth/guid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: userEmail})
    })
      .then(resp => resp.json())
      .then(json => {
        if (json.user_guid) {
          //yes
          let userGuid = json.user_guid;
          setUserGuid(userGuid);
          return userGuid;  
        } else {
          setUserGuidReq({userEmail})
        }
      })
      .catch(err => console.error('err', err))        
  }

  let authState = {status: curAuthState.status, logout, login, user, getUserGuid, setUserGuidReq}

  /**
   * Provider component is the place where you'd pass a prop called value to, 
   * which you can subsequently consume within the Consumer component
   */
  return (
    <AuthContext.Provider value={authState}>
      {curAuthState.status === 'pending' ? (
        'Loading...'
      ) : curAuthState.status === 'logged out' ? (
        children
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

//this seems simpler method to pass functions from context to consumers
function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context;
}

export {AuthProvider, useAuth};

// import React, { useState } from 'react';

// const AuthContext = React.createContext([{}, () => {}]);
// function AuthProvider({children}) {
//   const [state, setState] = useState({
//     userEmail: null,
//     userGuid: null,
//     sessionToken: null
//   });

//   const login = ({userEmail, sessionToken, userGuid}) => {
//     setState({...state, userEmail, userGuid, sessionToken});
//   }

//   const logout = () => {
//     setState({
//       userEmail: null,
//       userGuid: null,
//       sessionToken: null
//     });
//   }

//   let authState = {...state, logout, getUserGuid, login};

//   /**
//    * Provider component is the place where you'd pass a prop called value to, 
//    * which you can subsequently consume within the Consumer component
//    */
//   return (
//     <AuthContext.Provider value={authState}>
//       {state.status === 'pending' ? (
//         'Loading...'
//       ) : state.status === 'logged out' ? (
//         children
//       ) : (
//         children
//       )}
//     </AuthContext.Provider>
//   )
// }

// //this seems simpler method to pass functions from context to consumers
// function useAppAuth() {
//   const context = React.useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error(`useAuth must be used within a AuthProvider`)
//   }
//   return context;
// }

// export {AuthProvider, useAppAuth};