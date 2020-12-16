import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from './LogoutButton.module.css';

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      className={styles.btn_logout}
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;