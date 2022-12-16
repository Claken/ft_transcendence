import React, { useState } from "react";
import "../../styles/chat.scss";

const ModalRoomSettings = ({
  activeRoom,
  muteList,
  banList,
  type,
  updateChannelPassword,
  deleteChannelPassword,
  deleteARoom,
}) => {
  const [password, setPassword] = useState<String>("");
  const handleUpdatePassword = (newPassword: String) => {
    updateChannelPassword(newPassword);
  };

  const handleDeletePassword = () => {
    deleteChannelPassword();
  };

  const handleDeleteRoom = (activeRoom: String) => {
    deleteARoom(activeRoom);
  };

  const handleSubmitUpdatePassword = (event: FormEvent) => {
    event.preventDefault();
    handleUpdatePassword(password);
  };

  const handleSubmitDeletePassword = (event: FormEvent) => {
    event.preventDefault();
    handleDeletePassword();
  };
  const handleSubmitDeleteRoom = (event: FormEvent) => {
    event.preventDefault();
    handleDeleteRoom(activeRoom);
  };
  return (
    <div className="room-settings">
      <div className="top-settings">
        <h1>Room's name: {activeRoom}</h1>
      </div>
      <div className="sides-room-settings">
        <div className="room-settings-left">
          <div className="delete-room-settings">
            <form onSubmit={handleSubmitDeleteRoom}>
              <button>delete room</button>
            </form>
          </div>
          <div className="password-settings">
            {type == 2 ? (
              <form onSubmit={handleSubmitUpdatePassword}>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button>update password</button>
              </form>
            ) : null}
            {type == 2 ? (
              <form onSubmit={handleSubmitDeletePassword}>
                <button>delete password</button>
              </form>
            ) : null}
          </div>
        </div>
        <div className="room-settings-right">
          <div className="room-settings-lists">
            <div className="banmute-list">
              <h3>mute list</h3>
              <ul>
                {muteList.map((mutedUser) => (
                  <div className="member-element" key={mutedUser}>
                    <li key={mutedUser}>{mutedUser}</li>
                  </div>
                ))}
              </ul>
            </div>
            <div className="banmute-list">
              <h3>ban list</h3>
              <ul>
                {banList.map((bannedUser) => (
                  <div className="member-element" key={bannedUser}>
                    <li key={bannedUser}>{bannedUser}</li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRoomSettings;
