import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from 'react';
import { Redirect } from 'react-router-dom'

import { useAuth } from '../../context/auth-context';
import Input from '../FormShared/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
      name === 'email' ? setEmailError(''): setPasswordError('');
    }
  }

  //field validation
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required.')
    } else {
      const regex = /\w+@\w+\.\w+/g;
      const found = email.match(regex);
      if (!found) {
        setEmailError('Enter a valid email address.')
      } else {
        setEmailError('');
      }  
    }
  }

  // const validatePassword = () => {

  // }

  const formSubmitHandler = (ev) => {
    setLoginError('');
    ev.preventDefault();

    validateEmail();

    if (!emailError && !passwordError) {
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
        <Input type='text'
          id='email'
          name='email'
          label='Email'
          value={email}
          inputOnChangeHandler={inputChangeHandler}
          error={emailError}
        />

        <Input type='password'
          id='password'
          name='password'
          label='Password'
          value={password}
          inputOnChangeHandler={inputChangeHandler}
          error={passwordError}
        />


        {/* <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" value={email} 
            onChange={inputChangeHandler} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password}
            onChange={inputChangeHandler} />
        </div> */}
        <button onClick={formSubmitHandler}>Login</button>
      </form>
    </div>

  )
}

export default Login;