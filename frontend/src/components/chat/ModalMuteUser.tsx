import React, { useState } from "react";

const ModalMuteUser = ({
  name,
  userMuteUser,
  activeRoom,
  toggle,
  muteList,
}) => {
  const [timer, setTimer] = useState<number>(0);

  return (
    <div className="muteUser">
      <h1>Mute a user</h1>
      {muteList.find((mute: string) => mute === name) === undefined ? (
        <div className="not-mute">
          <p>
            Enter a mute duration: {" "}
            <input type="text" onChange={(e) => setTimer(e.target.value)} />
            <br />
            Do you really want to mute '{name}' from '{activeRoom}' for '{timer}'{" "}
            minute.s ?
          </p>
          <div className="confirm-button">
            <button
              onClick={() => {
                userMuteUser(name, timer);
                toggle();
              }}
            >
              confirm
            </button>
          </div>
        </div>
      ) : (
        <div className="already-mute">This user is already mute !</div>
      )}
      <div className="close-button">
        <button onClick={toggle}>close</button>
      </div>
    </div>
  );
};

export default ModalMuteUser;
