// src/components/nav-bar.js
import React, {useState} from "react";
import MainNav from "./MainNav";
import AuthNav from "./AuthNav";

const NavBar = () => {
  const [showNavMenu, setShowNavMenu] = useState(false);

  const toggleNavMenuDisplay = (ev) => {
    setShowNavMenu(!showNavMenu);
  }

  return (
    <header className="header">
      <nav >
        {!showNavMenu && (
          <div className="hamburger_icon" onClick={toggleNavMenuDisplay}>&#9776;</div>
        )}
        {showNavMenu && (
          <>
            <MainNav />
            <AuthNav />
          </>
        )}
      </nav>
      <div className="logo_title">Jobs Tracker</div>
    </header>
  );
};

export default NavBar;