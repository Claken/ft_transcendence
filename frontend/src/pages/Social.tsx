import React, { useState } from "react";
import FriendList from "../components/social/FriendList";
import Leaderboard from "../components/social/Leaderboard";
import Search from "../components/social/Search";
import "../styles/social.css";

function Social() {
  const [active, setActive] = useState("Leaderboard");

  return (
    <div>
      <div className="socialContainer">
        <div className="sortButtons">
          <button onClick={() => setActive("Leaderboard")}>Leaderboard</button>
          <button onClick={() => setActive("FriendList")}>Friend List</button>
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
