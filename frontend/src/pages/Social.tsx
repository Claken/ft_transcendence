import React, { useState, useEffect } from "react";
import FriendList from "../components/social/FriendList";
import Leaderboard from "../components/social/Leaderboard";
import Search from "../components/social/Search";
import { useDm } from "../contexts/DmContext";
import "../styles/social.css";

function Social() {
  const dmContext = useDm();
  const [active, setActive] = useState("Leaderboard");

  return (
    <div>
      <div className="socialContainer">
        <div className="sortButtons">
          <button onClick={() => setActive("Leaderboard")}>Leaderboard</button>
          {(dmContext.friendNotif && (
            <button onClick={() => setActive("FriendList")}>
              <div className="friendNotif">Friend List</div>
            </button>
          )) || (
            <button onClick={() => setActive("FriendList")}>Friend List</button>
          )}
          <button onClick={() => setActive("Search")}>Search</button>
        </div>
        {active === "Leaderboard" && <Leaderboard />}
        {active === "FriendList" && <FriendList />}
        {active === "Search" && <Search />}
      </div>
    </div>
  );
}

export default Social;
