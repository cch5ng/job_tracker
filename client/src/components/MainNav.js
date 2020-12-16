import {NavLink} from "react-router-dom";
import React from "react";

const MainNav = () => (
  <div className="main_nav_container">
    <NavLink
      to="/jobs"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      Jobs
    </NavLink>
    <NavLink
      to="/events/all"
      exact
      className="nav-link"
      activeClassName="router-link-exact-active"
    >
      Events
    </NavLink>
  </div>
);

export default MainNav;