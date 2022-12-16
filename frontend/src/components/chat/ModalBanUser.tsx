import React, { useState } from "react";

const ModalBanUser = ({ name, userBanUser, activeRoom, toggle, banList }) => {
  const [timer, setTimer] = useState(0);

  return (
    <div className="banUser">
      <h1>Ban a user</h1>
      {banList.find((ban: string) => ban === name) === undefined ? (
        <div className="not-ban">
          <p>
            Enter a ban duration
            <input type="text" onChange={(e) => setTimer(e.target.value)} />
            <br />
            Do you really want to ban '{name}' from '{activeRoom}' for '{timer}'{" "}
            minute.s ?
          </p>
          <div className="confirm-button">
          <button
            onClick={() => {
              userBanUser(name, timer);
              toggle();
            }}
          >
            confirm
          </button>
          </div>
        </div>
      ) : (
        <div className="already-ban">This user is already ban !</div>
      )}
      <div className="close-button">
      <button onClick={toggle}>close</button>
      </div>
    </div>
  );
};

export default ModalBanUser;
