import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import LogContext from "../contexts/LogContext";
import Navigation from "../components/Navigation.tsx";

function Account() {
  const { isLog, setIsLog } = useContext(LogContext);

  return (
    <div className="background">
      <Navigation />
      <h1>Account</h1>
    </div>
  );
}

export default Account;
