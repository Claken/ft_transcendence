import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import LogContext from "../contexts/LogContext";
import "../styles/navigation.css";

function Navigation() {
  const { isLog, setIsLog } = useContext(LogContext);

  const setLogout = () => {
    setIsLog(false);
  };

  return (
    <nav>
      <ul className="list">
        {(isLog && (
          <>
            <li className="space">
              <NavLink className="link" to="/">
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
              <button className="btngreen" onClick={setLogout}>
                Logout
              </button>
            </li>
          </>
        )) || (
          <>
            <li className="spacenotlog">
              <NavLink className="link" to="/">
                <button className="btngreen">Home</button>
              </NavLink>
            </li>
            <li>
              <NavLink className="link" to="/login">
                <button className="btngreen">Login</button>
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <div className="separate"></div>
    </nav>
  );
}

export default Navigation;
