import React, { useState } from "react";

const ModalMuteUser = ({ name, userMuteUser, activeRoom, toggle, muteList }) => {
  const [timer, setTimer] = useState(0);

  return (
    <div>
      {muteList.find((mute: string) => mute === name) === undefined ?
      <div className="not-Mute">
		<p>
		enter mute duration
		<input type="text" onChange={(e) => setTimer(e.target.value)} />
		<br />
		Do you really want to mute {name} from {activeRoom} for {timer} minute.s ?
		</p>
        <button onClick={() => 
			{
				userMuteUser(name, timer);
				toggle();
			}}>confirm</button>
      </div> :
      <div className="already-Mute">
        This user is already mute !
      </div>
      }  
      <button onClick={toggle}>close</button>
    </div>
  );
};

export default ModalMuteUser;
