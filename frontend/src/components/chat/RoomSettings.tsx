import React from "react";
import "../../styles/chat.scss";
import Modal from "../modal";
import useModal from "../../hooks/useModal";
import { type } from "../../interfaces/enum";
import ModalRoomSettings from "./ModalRoomSettings";

const RoomSettings = ({activeRoom, muteList, banList, type, owner,deleteChannelPassword, updateChannelPassword, deleteARoom}) => {
  const { isOpen, toggle } = useModal();

  return (
    <div className="room-settings">
      <button onClick={toggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-settings"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalRoomSettings activeRoom={activeRoom}
        updateChannelPassword={updateChannelPassword}
        muteList={muteList}
        banList={banList}
        owner={owner}
        type={type}
        deleteChannelPassword={deleteChannelPassword}
        deleteARoom={deleteARoom}
        />
      </Modal>
    </div>
  );
};

export default RoomSettings;
