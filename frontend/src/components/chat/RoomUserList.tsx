import React from "react";
import "../../styles/chat.scss";
import Modal from "../modal";
import useModal from "../../hooks/useModal";
import { ModalSetAdmin } from "./ModalSetAdmin";
import ModalMuteUser from "./ModalMuteUser";

const RoomUserList = ({
  findActiveRoom,
  userSetAdmin,
  userBanUser,
  userMuteUser,
  isAdminInActive,
  username,
  activeRoom,
}) => {
  const { isOpen, toggle } = useModal();

  return (
    <div className="rigth-side">
      Members :
      <br />
      <div className="member-list">
        <ul>
          {findActiveRoom().usersList ? (
            findActiveRoom().usersList.map((name: string) =>
              isAdminInActive(username) &&
              name != username &&
              name != findActiveRoom().owner ? (
                <li key={name}>
                  {name}
                  <button onClick={toggle}>admin</button>
                  <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalSetAdmin
                      name={name}
                      userSetAdmin={userSetAdmin}
                      activeRoom={activeRoom}
                      toggle={toggle}
                    />
                  </Modal>
                  <button onClick={toggle}>mute</button>
                  <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalMuteUser
                      name={name}
                      userMuteUser={userMuteUser}
                      activeRoom={activeRoom}
                      toggle={toggle}
                    />
                  </Modal>
                  <button onClick={() => userBanUser(name)}>ban</button>
                  {/* <Modal isOpen={isOpen} toggle={toggle}>
                <ModalBanUser />
              </Modal> */}
                </li>
              ) : (
                <div key={name}>
                  <li>{name}</li>
                </div>
              )
            )
          ) : (
            <div></div>
          )}
        </ul>
      </div>
      Admins :
      <div className="admin-list">
        <ul>
          {findActiveRoom().adminsList ? (
            findActiveRoom().adminsList.map((name: string) => (
              <li key={name}>{name}</li>
            ))
          ) : (
            <div></div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RoomUserList;
