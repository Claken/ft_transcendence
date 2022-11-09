import { useEffect, useState } from "react";
import "../styles/account.css";
import Modal from "../components/modal";
import useModal from "../hooks/useModal";
import { useAuth } from "../contexts/AuthContext";

function Account() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };
  const [stylePic, setStylePic] = useState<string>("guestPic");
  useEffect(() => {
    if (auth.user && auth.user.login) {
      setStylePic("profilePic");
    }
  }, [auth.user]);

  const { isOpen, toggle } = useModal();
  const User = "Edouard";
  const Win = "10";
  const Lose = "0";
  return (
    <div>
      <div className="container">
        <div className="profile-container">
          <div className="left-container">
            <div className="profile-picture">
              <img
                className={stylePic}
                src={auth.user?.pictureUrl}
                alt="profilePic"
              />
            </div>
            <div className="profile-stats">
              <h1> {auth?.user?.name}</h1>
              <h2>
                Win - lose : {auth?.user?.win} - {auth?.user?.lose}{" "}
              </h2>
            </div>
            <div className="profile-buttons">
              <button onClick={toggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-settings"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <Modal isOpen={isOpen} toggle={toggle}>
                <div className="modal-settings">
                  <div className="picture-settings">
                    <div className="profile-picture">
                      <img
                        className={stylePic}
                        src={auth.user?.pictureUrl}
                        alt="profilePic"
                      />
                    </div>
                    <div className="uploadButton">
                      <input type="file" />
                    </div>
                  </div>
                  <div className="username-settings">
                    <h2>{auth.user?.name}</h2>
                    <input type="text" />
                    <button> change usename</button>
                  </div>
                  <div className="twoFA-settings">
                    <h2>2FA status</h2>
                    <h3 style={{ color: "red" }}>Disabled</h3>
                    <button>2FA</button>
                  </div>
                </div>
              </Modal>
              <button onClick={handleLogout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-logout"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                  <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="right-container">
            <div className="matchHistory">
              <div className="matchHistory-header">
                <h1>Match History</h1>
              </div>
              <div className="matchHistory-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
