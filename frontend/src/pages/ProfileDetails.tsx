import React, { useState, useEffect } from "react";
import axios from "../axios.config";
import { IUser } from "../interfaces/user.interface";
import { useAuth } from "../contexts/AuthContext";
import UserNotFound from "../components/social/UserNotFound";

function ProfileDetails() {
  const auth = useAuth();
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [userProfile, setUserProfile] = useState(
    window.location.pathname.substring(
      window.location.pathname.lastIndexOf("/") + 1
    )
  );
  const [names, setNames] = useState(
    users && users.map((user: IUser) => user?.name)
  );

  const [isValidName, setIsValidName] = useState(
    names && names.includes(userProfile)
  );

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("/users")
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getData();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      await axios
        .get("/users/" + userProfile)
        .then((res) => {
          if (res.data) {
            setUser(null);
            setUser(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  });

  if (!user) return null;

  return (
    <div>
      {(isValidName && (
        <div className="account-container">
          <div className="profile-container">
            <div className="left-container">
              <div className="profile-picture">
                <img
                  className="stylePic"
                  src={user.pictureUrl}
                  alt="profilePic"
                />
              </div>
              <div className="profile-stats">
                <h1> {user.name}</h1>
                <h2>
                  Win - lose : {user.win} - {user.lose}{" "}
                </h2>
              </div>
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
      )) || <UserNotFound />}
    </div>
  );
}

export default ProfileDetails;
