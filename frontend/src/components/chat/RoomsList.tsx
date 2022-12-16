import React from "react";
import "../../styles/chat.scss";
import { type } from "../../interfaces/enum";
import Modal from "../modal";
import useModal from "../../hooks/useModal";
import ModalAddARoom from "./ModalAddARoom";

const RoomsList = ({ rooms, findRoom, setActiveForRoom, addARoom, switchDm }) => {
  const { isOpen, toggle } = useModal()
  return (
    <div className="left-side">
      <div className="rooms-list">
        <ul>
          {rooms.map((room: any, id: number) =>
            !(room.type === type.private && room.member === false) ? (
              <li key={room.name}>
                <button
                  onClick={() =>
                    findRoom(room.name).ban
                      ? alert("you are banned from this channel")
                      : setActiveForRoom(room.name)
                  }
                >
                  {room.name}
                </button>
              </li>
            ) : null
          )}
        </ul>
      </div>
      <div className="room-buttons">
          <button onClick={toggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-message-plus"
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
              <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path>
              <line x1="10" y1="11" x2="14" y2="11"></line>
              <line x1="12" y1="9" x2="12" y2="13"></line>
            </svg>
          </button>
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalAddARoom addARoom={addARoom} toggle={toggle}/>
      </Modal>
      <form onSubmit={switchDm}>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-switch-3"
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
                <path d="M3 17h2.397a5 5 0 0 0 4.096 -2.133l.177 -.253m3.66 -5.227l.177 -.254a5 5 0 0 1 4.096 -2.133h3.397"></path>
                <path d="M18 4l3 3l-3 3"></path>
                <path d="M3 7h2.397a5 5 0 0 1 4.096 2.133l4.014 5.734a5 5 0 0 0 4.096 2.133h3.397"></path>
                <path d="M18 20l3 -3l-3 -3"></path>
              </svg>
            </button>
          </form>
      </div>
    </div>
  );
};

export default RoomsList;
