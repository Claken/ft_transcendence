import React, { useEffect, useState } from "react";
import { useDm } from "../../contexts/DmContext";
import "../../styles/friend.css";

function FriendRequestButton(props) {
	const dmContext = useDm();

	const acceptFriendRequest = () => {
		dmContext.socket.emit('accept_friendRequest', {
			sender: props.user.name,
			receiver: dmContext.me.name,
		});
	}

	const refuseFriendRequest = () => {
		dmContext.socket.emit('refuse_friendRequest', {
			sender: props.user.name,
			receiver: dmContext.me.name,
		});
	}

  return (
    <li key={props.user.id}>
      <div className="friendrequestbtn">
        <div className="left">{props.user.name} wants to be your friend</div>
        <div className="middle">
          <button className="requestbtn" onClick={() => acceptFriendRequest()}>accept</button>
        </div>
        <div className="right">
          <button className="requestbtn" onClick={() => refuseFriendRequest()}>refuse</button>
        </div>
      </div>
    </li>
  );
}

export default FriendRequestButton;
