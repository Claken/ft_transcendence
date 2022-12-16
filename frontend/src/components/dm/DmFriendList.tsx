import React from "react";
import { useDm } from "../../contexts/DmContext";
import "../../styles/dmchat.css";

function DmFriendList(props) {
  const dmContext = useDm();

  return (
    <li key={props.user.id}>
      <button className="dmfriendlist" onClick={() => dmContext.changeTarget(props.user)}>{props.user.name}</button>
    </li>
  );
}

export default DmFriendList;