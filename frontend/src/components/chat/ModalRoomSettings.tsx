import React, { useState } from "react";
import "../../styles/chat.scss";

const ModalRoomSettings = ({
  activeRoom,
  muteList,
  banList,
  owner,
  type,
  updateChannelPassword,
  deleteChannelPassword,
  deleteARoom,
}) => {
  const [password, setPassword] = useState<String>("");
  const handleUpdatePassword = (newPassword: String) => {
    updateChannelPassword(newPassword);
  };

  const handleDeleteRoom = (activeRoom: String) => {
    deleteARoom(activeRoom);
  };

  const handleSubmitUpdate = (event: FormEvent) => {
    event.preventDefault();
    handleUpdatePassword(password);
  };
  
  const handleSubmitDelete = (event: FormEvent) => {
    event.preventDefault();
    handleDeleteRoom(activeRoom);
  };
  return (
    <div className="room-settings">
      <div className="top-settings">
        <h1>{activeRoom}</h1>
      </div>
      <div className="room_settings_left">
        {type == 2 ? (
          <form onSubmit={handleSubmitUpdate}>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>
              update password
            </button>
          </form>
        ) : null}

        <form onSubmit={handleSubmitDelete}>
          <button >
            delete room
          </button>
        </form>
      </div>
      <div className="room_settings_right">
        <div className="room-setting-lists">
          <div className="mute-list">
            <ul>
              {muteList.map((mutedUser) => (
                <li key={mutedUser}>{mutedUser}</li>
              ))}
            </ul>
          </div>
          <div className="ban-list">
            <ul>
              {banList.map((bannedUser) => (
                <li key={bannedUser}>{bannedUser}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRoomSettings;
