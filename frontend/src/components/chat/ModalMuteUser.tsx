import React, { useState } from "react";

const ModalMuteUser = ({ name, userMuteUser, activeRoom, toggle }) => {
  const [timer, setTimer] = useState(0);

  return (
    <div>
      <p>
        enter mute duration
        <input type="text" onChange={(e) => setTimer(e.target.value)} />
        <br />
        Do you really want to mute {name} in {activeRoom}
        for {timer} minutes ?
      </p>
      <button onClick={() => userMuteUser(name, timer)}>confirm ------ </button>
      <button onClick={toggle}>close</button>
    </div>
  );
};

export default ModalMuteUser;
