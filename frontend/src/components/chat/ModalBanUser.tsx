import React, { useState } from "react";

const ModalBanUser = ({ name, userBanUser, activeRoom, toggle }) => {
  const [timer, setTimer] = useState(0);

  return (
    <div>
      <p>
        enter ban duration
        <input type="text" onChange={(e) => setTimer(e.target.value)} />
        <br />
        Do you really want to ban {name} from talking in {activeRoom}
        for {timer} minutes ?
      </p>
      <button onClick={userBanUser(name, timer)}>confirm</button>
      <button onClick={toggle}>close</button>
    </div>
  );
};

export default ModalBanUser;
