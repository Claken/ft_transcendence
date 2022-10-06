import React, { useContext } from "react";
import LogContext from "../contexts/LogContext";
import Navigation from "../components/Navigation.tsx";

function Channel() {
  const { isLog, setIsLog } = useContext(LogContext);

  return (
    <div className="background">
      <Navigation />
      <h1>Channel</h1>
    </div>
  );
}

export default Channel;
