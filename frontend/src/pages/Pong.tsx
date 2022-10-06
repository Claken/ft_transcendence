import React, { useContext } from "react";
import LogContext from "../contexts/LogContext";
import Navigation from "../components/Navigation.tsx";

function Pong() {
  const { isLog, setIsLog } = useContext(LogContext);

  return (
    <div className="background">
      <Navigation />
      <h1>Pong</h1>
    </div>
  );
}

export default Pong;
