import {NavLink} from "react-router-dom";
import React from "react";
import styles from './MainNav.module.css';

const MainNav = () => (
  <div className={styles.main_nav_container}>
    <div className={styles.nav_row} >
      <NavLink
        to="/jobs"
        exact
        className={styles.nav_link}
        activeClassName="router-link-exact-active"
      >
        Jobs
      </NavLink>
    </div>
    <div className={styles.nav_row} >
      <NavLink
        to="/events"
        exact
        className={styles.nav_link}
        activeClassName="router-link-exact-active"
      >
        Events
      </NavLink>
    </div>
  </div>
);

export default MainNav;