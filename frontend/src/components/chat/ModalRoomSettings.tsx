import React from "react";
import "../../styles/chat.scss";

const ModalRoomSettings = ({ activeRoom, muteList, banList }) => {
  return (
    <div className="room-settings">
      <div className="top-settings"></div>
      <div className="room_settings_left">
        <h1>{activeRoom}</h1>
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
