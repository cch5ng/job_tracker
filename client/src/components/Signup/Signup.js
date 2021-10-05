import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, {useState} from 'react';
import { Redirect } from 'react-router-dom'
import LoginButton from "../Header/LoginButton";

import { useAuth } from '../../context/auth-context'

  const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupError, setSignupError] = useState('');
    const auth = getAuth();
  
    const {status, setUserGuidReq} = useAuth();
  
    const inputChangeHandler = (ev) => {
      const {name, value} = ev.target;
      if (name === 'email') {
        setEmail(value);
      }
      if (name === 'password') {
        setPassword(value);
      }
      if (!value) {
        setSignupError('');
      }
    }
  
    //field validation
  
    const formSubmitHandler = (ev) => {
      setSignupError('');
      ev.preventDefault();

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          user.getIdToken()
            .then(idToken => {
              setUserGuidReq({userEmail: email, fbIdToken: idToken});
            })
            .catch(error => console.error('err', error))
        })
        .catch((error) => {
          console.log('error', error);
          setSignupError(error.message);
        });
    }
  
    if (status && status === 'logged in') {
      return (
        <Redirect to="/jobs" />
      )
    }
  
    return (
      <div>
        <h1>Signup</h1>
        {signupError.length > 0 && (
          <div>{signupError}</div>
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
          <button onClick={formSubmitHandler}>Sign Up</button>
        </form>
      </div>
    );
  }
  
  export default Signup;