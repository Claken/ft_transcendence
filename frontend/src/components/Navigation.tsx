import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navigation.css";

function Navigation() {
  return (
    <nav>
      <ul className="list">
        <li className="space">
          <NavLink className="link" to="/" >
            <button className="btngreen">Home</button>
          </NavLink>
        </li>
        <li className="space">
          <NavLink className="link" to="/pong">
            <button className="btn">Pong</button>
          </NavLink>
        </li>
        <li className="space">
          <NavLink className="link" to="/Channel">
            <button className="btn">Channel</button>
          </NavLink>
        </li>
        <li className="space">
          <NavLink className="link" to="/account">
            <button className="btn">Account</button>
          </NavLink>
        </li>
        <li>
          <NavLink className="link" to="/register">
            <button className="btngreen">Register</button>
          </NavLink>
        </li>
      </ul>
			<div className="separate"></div>
    </nav>
  );
}

export default Navigation;
