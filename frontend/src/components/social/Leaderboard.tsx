import React from "react";
import { useDm } from "../../contexts/DmContext";

function Leaderboard() {
  const dmContext = useDm();
  return (
    <div className="leaderboard">
      <h1>LeaderBoard</h1>
    </div>
  );
}

export default Leaderboard;
