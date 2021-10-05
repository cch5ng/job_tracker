import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from 'react';
import { Redirect } from 'react-router-dom'

import { useAuth } from '../../context/auth-context'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const auth = getAuth();
  const {status, setUserGuidReq, getUserGuidReq, login} = useAuth();

  const inputChangeHandler = (ev) => {
    const {name, value} = ev.target;
    if (name === 'email') {
      setEmail(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
    if (!value) {
      setLoginError('');
    }
  }

  //field validation

  const formSubmitHandler = (ev) => {
    setLoginError('');
    ev.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        user.getIdToken()
          .then(idToken => {
            getUserGuidReq({userEmail: email, fbIdToken: idToken});
            login();    
          })
          .catch(error => console.error('err', error))
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error', error);
        setLoginError(error.message);
    });
  
  }

  if (status && status === 'logged in') {
    return (
      <Redirect to="/jobs" />
    )
  }


  return (

    <div>
      <h1>Login</h1>
      {loginError.length > 0 && (
        <div>{loginError}</div>
      )}
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" value={email} 
            onChange={inputChangeHandler} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password}
            onChange={inputChangeHandler} />
        </div>
        <button onClick={formSubmitHandler}>Login</button>
      </form>
    </div>

  )
}

export default Login;