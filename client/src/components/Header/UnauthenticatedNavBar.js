// src/components/nav-bar.js
import React, {useState} from "react";
import {Link} from 'react-router-dom';
import MainNav from "./MainNav";
import AuthNav from "./AuthNav";

const UnauthenticatedNavBar = () => {
  return (
    <header className="header header_unauthenticated">
      <div className="logo_title logo_title_unauthenticated">Jobs Tracker</div>
      <Link to="/signup">Signup</Link>
      <Link to="/login">Log In</Link>
    </header>
  );
};

export default UnauthenticatedNavBar;