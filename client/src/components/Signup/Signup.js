import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, {useState} from 'react';
import { Redirect } from 'react-router-dom'
import LoginButton from "../Header/LoginButton";

import { useAuth } from '../../context/auth-context'

  const Signup = ({ firebase }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
  
    const {login, status} = useAuth();
  
    const inputChangeHandler = (ev) => {
      const {name, value} = ev.target;
      if (name === 'email') {
        setEmail(value);
      }
      if (name === 'password') {
        setPassword(value);
      }
    }
  
    //field validation
  
    const formSubmitHandler = (ev) => {
      ev.preventDefault();

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          login();
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    
      // firebase.auth().createUserWithEmailAndPassword(email, password)
      // .then((userCredential) => {
      //   // Signed in 
      //   var user = userCredential.user;
      //   user.getIdToken()
      //     .then(token => {
      //       window.localStorage.setItem('blackjackAuthToken', token);
      //       login();
      //     })
      //     .catch(err => console.error('error retrieving token'))
      // })
      // .catch((error) => {
      //   var errorCode = error.code;
      //   var errorMessage = error.message;
      //   // ..
      // });
    
    }
  
    if (status && status === 'logged in') {
      return (
        <Redirect to="/jobs" />
      )
    }
  
    return (
      <div>
        <h1>Signup</h1>
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