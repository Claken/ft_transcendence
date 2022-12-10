import React, { useEffect, useState } from "react";
import "../styles/buttonprofile.css";
import "../styles/page.css";
import "../styles/navigation.css";
import { useAuth } from "../contexts/AuthContext";

function ButtonProfile() {
  const auth = useAuth();

  return (
    <button className="btnprofile">
      <div className="btnprofile-left">{auth.user.name}</div>
      <div className="btnprofile-right">
        <img className="profilePic" src={auth.user.avatarUrl} />
      </div>
    </button>
  );
}

export default ButtonProfile;
