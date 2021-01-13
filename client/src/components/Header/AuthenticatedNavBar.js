// src/components/nav-bar.js
import React, {useState} from "react";
import classNames from 'classnames/bind';
import MainNav from "./MainNav";
import AuthNav from "./AuthNav";
import styles from './NavBar.module.css';

let cx = classNames.bind(styles);

const AuthenticatedNavBar = ({showNavMenu, toggleNavMenuDisplay}) => {
  let hamburgerClassName = cx({
    hamburger_icon: true,
    hamburger_icon_rotated: showNavMenu
  });

  let navMenuClassName = cx({
    nav_menu: showNavMenu
  })

  return (
    <header className="header header_authenticated">
      <nav >
        <div className={hamburgerClassName} onClick={(ev) => toggleNavMenuDisplay(ev)}>&#9776;</div>
        {showNavMenu && (
          <div className={navMenuClassName}>
            <div className={styles.close_icon} onClick={(ev) => toggleNavMenuDisplay(ev)}>X</div>
            <MainNav />
            <AuthNav />
          </div>
        )}
      </nav>
      <div className="logo_title logo_title_authenticated">Jobs Tracker</div>
    </header>
  );
};

export default AuthenticatedNavBar;