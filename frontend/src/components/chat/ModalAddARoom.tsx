import React, { useState } from "react";

const ModalAddARoom = ({ addARoom, toggle }) => {
  const [password, setPassword] = useState<String>(null);
  const [roomName, setRoomName] = useState<String>(null);
  const [typeRoom, setTypeRoom] = useState<Number>(-1);

  const handleSubmit = (event) => {
    event.preventDefault();
    addARoom(roomName, typeRoom, password);
  };

  return (
    <div>
      <h1>create a room</h1>
		<div className="text-input">
		room name
        <input
          type="text"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
        />
		</div>
        <br />
		<div className="radio-inputs">
		room type
        <input
          type="radio"
          name="typeRoom"
          id="public"
          value="0"
          checked={typeRoom === "0"}
          onChange={(event) => setTypeRoom(event.target.value)}
        />
        public
        <input
          type="radio"
          name="typeRoom"
          id="private"
          value="1"
          checked={typeRoom === "1"}
          onChange={(event) => setTypeRoom(event.target.value)}
        />
        private
        <input
          type="radio"
          name="typeRoom"
          id="protected"
          value="2"
          checked={typeRoom === "2"}
          onChange={(event) => setTypeRoom(event.target.value)}
        />
        protected
		</div>
        <br />
        {typeRoom === "2" && (
          <div className="pass-for-protected">
            password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        )}
        <button onClick={handleSubmit}>confirm</button>
      <button onClick={toggle}>close</button>
    </div>
  );
};

export default ModalAddARoom;
