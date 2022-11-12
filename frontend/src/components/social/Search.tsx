import React from "react";
import "../../styles/social.css";
import DmList from "../dm/DmList";

function Search() {
  return (
    <div className="searchContainer">
      <DmList />
      <div className="searchBar">
        <input type="text" />
      </div>
    </div>
  );
}

export default Search;
