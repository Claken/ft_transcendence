import { useEffect, useState } from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import pongLogo from "../assets/logo/white_pong.png";
import ButtonProfile from "./ButtonProfile";

import "../styles/navigation.css";

function Navigation() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  const [stylePic, setStylePic] = useState<string>("guestPic");
  // TODO: change the fact that stylepic depends on size upload

  useEffect(() => {
    if (auth.user && auth.user.login) {
      //TODO: css change
      setStylePic("profilePic");
    }
  }, [auth.user]);

  return (
    <nav className="nav">
      {(auth.user && (
        <>
          <ul>
            <CustomLink to="/Social">Social</CustomLink>
            <CustomLink to="/Account">Profil</CustomLink>
          </ul>
          <div className="logo">
            <Link to="/pong" style={{ padding: "0.5px", margin: "0.5px" }}>
              <img src={pongLogo} height="90px" alt="game logo" />
            </Link>
          </div>
          <ul>
            <CustomLink to="/Channel">Chat</CustomLink>
            <ButtonProfile />
            {/* <li className="userListElement">
              <div className="userName">
                <h3>{auth.user.name}</h3>
              </div>
              <div className="userProfilePicture">
                <img
                  className={stylePic}
                  src={auth.user?.pictureUrl}
                  alt="profilePic"
                />
              </div>
            </li> */}
          </ul>
        </>
      )) || (
        <div className="">
          <Link to="/login" style={{ padding: "0.5px", margin: "0.5px" }}>
            <img src={pongLogo} height="70px" alt="game logo" />
          </Link>
        </div>
      )}
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navigation;
