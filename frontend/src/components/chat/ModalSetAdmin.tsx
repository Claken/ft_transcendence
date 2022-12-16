import React from "react";

export const ModalSetAdmin = ({ name, userSetAdmin, activeRoom, toggle }) => {
  return (
    <div className="setAdmin">
      <p>
        Do you really want to set '{name}' as an administrator of the room{" "}
        '{activeRoom}' ?
      </p>
      <div className="setAdmin-buttons">
      <button
        onClick={() => {
          userSetAdmin(name);
          toggle();
        }}
      >
        confirm
      </button>
      <button onClick={toggle}>close</button>
      </div>
    </div>
  );
};

export default ModalSetAdmin;
