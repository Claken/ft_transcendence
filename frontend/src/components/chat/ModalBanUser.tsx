import React, { useState } from "react";

const ModalBanUser = ({ name, userBanUser, activeRoom, toggle, banList }) => {
  const [timer, setTimer] = useState(0);

  return (
    <div>
      {banList.find((ban: string) => ban === name) === undefined ?
      <div className="not-ban">
		<p>
		enter ban duration
		<input type="text" onChange={(e) => setTimer(e.target.value)} />
		<br />
		Do you really want to ban {name} from {activeRoom}
		for {timer} minutes ?
		</p>
        <button onClick={() => 
			{
				userBanUser(name, timer);
				toggle();
			}}>confirm</button>
      </div> :
      <div className="already-ban">
        This user is already ban !
      </div>
      }  
      <button onClick={toggle}>close</button>
    </div>
  );
};

export default ModalBanUser;
