import React from "react";

export const ModalSetAdmin = ({ name, userSetAdmin, activeRoom, toggle }) => {
  return (
    <div>
      <p>
        Do you really want to set {name} as an administrator of the room {activeRoom} ?
      </p>
      <button onClick={userSetAdmin(name)}>confirm</button>
	  <button onClick={toggle}>close</button>

    </div>
  );
};

export default ModalSetAdmin;
