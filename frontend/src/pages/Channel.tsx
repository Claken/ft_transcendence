import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import LogContext from "../contexts/LogContext";
import Navigation from "../components/Navigation.tsx";

function Channel() {
  const { isLog, setIsLog } = useContext(LogContext);

  return (
    <nav>
      {(isLog && (
        <>
          <div className="background">
            <Navigation />
            <h1>Channel</h1>
          </div>
        </>
      )) || (
        <>
          <Navigate to="/login" />
        </>
      )}
    </nav>
  );
}

export default Channel;
