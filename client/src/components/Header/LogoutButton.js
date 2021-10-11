import React from "react";
import { getAuth, signOut } from "firebase/auth";
import {useAuth} from "../../context/auth-context";

import styles from './LogoutButton.module.css';

const LogoutButton = () => {
  const auth = getAuth();
  const {logout} = useAuth();

  const logOutUser = (ev) => {
    signOut(auth).then(() => {
      logout();
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });    
  }

  return (
    <button
      className={styles.btn_logout}
      onClick={logOutUser}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;