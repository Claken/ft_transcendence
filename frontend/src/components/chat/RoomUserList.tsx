import React from "react";
import "../../styles/chat.scss";
import Modal from "../modal";
import useModal from "../../hooks/useModal";
import { ModalSetAdmin } from "./ModalSetAdmin";
import ModalMuteUser from "./ModalMuteUser";
import ModalBanUser from "./ModalBanUser";
import { type } from "../../interfaces/enum";
import { Link } from "react-router-dom";

const RoomUserList = ({
  findActiveRoom,
  userSetAdmin,
  userBanUser,
  userMuteUser,
  isAdminInActive,
  username,
  activeRoom,
  banList,
  muteList,
}) => {
  const { isOpen: isSetAdminOpen, toggle: toggleSetAdmin } = useModal();
  const { isOpen: isMuteUserOpen, toggle: toggleMuteUser } = useModal();
  const { isOpen: isBanUserOpen, toggle: toggleBanUser } = useModal();

  return (
    <div className="rigth-side">
      <div className="member-list">
        <h2> Admins :</h2>
        <ul>
          {findActiveRoom().adminsList &&
          activeRoom != "" &&
          (findActiveRoom().member || findActiveRoom().type === type.public) ? (
            findActiveRoom().adminsList.map((name: string) => (
              <div className="member-element" key={name}>
                <li key={name}>
                  <div className="member-name">{name}</div>
                </li>
              </div>
            ))
          ) : (
            <div key="empty"></div>
          )}
        </ul>
      </div>
      <div className="member-list">
        <h2> Members :</h2>
        <ul>
          {findActiveRoom().adminsList &&
          activeRoom != "" &&
          (findActiveRoom().member || findActiveRoom().type === type.public) ? (
            findActiveRoom().usersList.map((name: string) =>
              isAdminInActive(username) &&
              name != username &&
              name != findActiveRoom().owner ? (
                <div className="member-element" key={name}>
                  <li key={name}>
                    <div className="member-name">{name}</div>
                    <div className="member-buttons">
                    <Link to={"/profile/" + name}>
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-user"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <circle cx="12" cy="7" r="4"></circle>
                          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                      </button>
                    </Link>
                      <button onClick={toggleSetAdmin}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-crown"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z"></path>
                        </svg>
                      </button>
                      <Modal isOpen={isSetAdminOpen} toggle={toggleSetAdmin}>
                        <ModalSetAdmin
                          name={name}
                          userSetAdmin={userSetAdmin}
                          activeRoom={activeRoom}
                          toggle={toggleSetAdmin}
                        />
                      </Modal>
                      <button onClick={toggleMuteUser}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-volume-3"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a0.8 .8 0 0 1 1.5 .5v14a0.8 .8 0 0 1 -1.5 .5l-3.5 -4.5"></path>
                          <path d="M16 10l4 4m0 -4l-4 4"></path>
                        </svg>
                      </button>
                      <Modal isOpen={isMuteUserOpen} toggle={toggleMuteUser}>
                        <ModalMuteUser
                          name={name}
                          userMuteUser={userMuteUser}
                          activeRoom={activeRoom}
                          toggle={toggleMuteUser}
                          muteList={muteList}
                        />
                      </Modal>
                      <button onClick={toggleBanUser}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-ban"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <circle cx="12" cy="12" r="9"></circle>
                          <line x1="5.7" y1="5.7" x2="18.3" y2="18.3"></line>
                        </svg>
                      </button>
                      <Modal isOpen={isBanUserOpen} toggle={toggleBanUser}>
                        <ModalBanUser
                          name={name}
                          userBanUser={userBanUser}
                          activeRoom={activeRoom}
                          toggle={toggleBanUser}
                          banList={banList}
                        />
                      </Modal>
                    </div>
                  </li>
                </div>
              ) : (
                <div className="member-element" key={name}>
                  <li key={name}>
                    <div className="member-name">{name}</div>
                    <div className="member-buttons">
                    <Link to={"/profile/" + name}>
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-user"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <circle cx="12" cy="7" r="4"></circle>
                          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                      </button>
                    </Link>
                    </div>
                  </li>
                </div>
              )
            )
          ) : (
            <div key="empty"></div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RoomUserList;
