import React, { useContext } from "react";
import LogContext from "../contexts/LogContext";
import Navigation from "../components/Navigation";
import Game from "../components/Game"

function Pong() {
  const { isLog, setIsLog } = useContext(LogContext);

  return (
    <div className="background">
      <Navigation />
      <h1><Game/ ></h1>
    </div>
  );
}

export default Pong;
