import React, { useEffect, useState } from "react";
import { useDm } from "../../contexts/DmContext";
import "../../styles/friend.css";

function PrRoomInviteButton(props) {
	const dmContext = useDm();

	const acceptPrRoomInvite = () => {
		dmContext.socket.emit('acceptPrivateRoomInvite', {
			sender: props.user,
			receiver: dmContext.me.name,
			message: props.channel
		});
	}

	const refusePrRoomInvite = () => {
		dmContext.socket.emit('refusePrivateRoomInvite', {
			sender: props.user,
			receiver: dmContext.me.name,
		});
	}

  return (
    <li key={props.key}>
      <div className="friendrequestbtn">
        <div className="left">{props.user} wants you to join "{props.channel}"</div>
        <div className="middle">
          <button className="requestbtn" onClick={() => acceptPrRoomInvite()}>accept</button>
        </div>
        <div className="right">
          <button className="requestbtn" onClick={() => refusePrRoomInvite()}>refuse</button>
        </div>
      </div>
    </li>
  );
}

export default PrRoomInviteButton;