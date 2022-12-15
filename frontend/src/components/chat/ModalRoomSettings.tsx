import React from 'react'
import "../../styles/chat.scss";

const ModalRoomSettings = ({activeRoom, muteList, banList}) => {
  return (
	<div>
		<ul>
			{muteList.map((name) => 
			<li key={name}>
				{name}
			</li>
			)}
			{console.log(muteList)}
		</ul>
	</div>
  )
}

export default ModalRoomSettings