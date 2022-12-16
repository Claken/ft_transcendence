import React, { useState, useEffect } from "react";
import axios from "../axios.config";
import { IUser } from "../interfaces/user.interface";
import UserNotFound from "../components/social/UserNotFound";
import { socket } from "../components/Socket";
import { IGame } from "../interfaces/game.interface";
import { useAuth } from "../contexts/AuthContext";

function ProfileDetails() {
  const auth = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser>();
  const [games, setGames] = useState<IGame[]>([]);

  // const [avatar, setAvatar] = useState<string>();

  const userProfile = window.location.pathname.substring(
    window.location.pathname.lastIndexOf("/") + 1
  );
  const names = users && users.map((user: IUser) => user?.name);
  const isValidName = names && names.includes(userProfile);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("users")
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
        .get("users/name/" + userProfile)
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

  useEffect(() => {
    const getMyGames = () => {
      axios
        .get("game/login/" + user?.login)
        .then((res) => {
          setGames(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (user?.login) {
      getMyGames();
    }
  }, []);

  // useEffect(() => {
  //   const getAvatar = async () => {
  //     await axios
  //       .get("avatar")
  //       .then((res) => {
  //         if (res.data) {
  //           setAvatar(null);
  //           setAvatar(res.data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };
  //   getAvatar();
  // });

  if (!user) return null;

  return (
    <div>
      {(isValidName && (
        <div className="account-container">
          <div className="profile-container">
            <div className="left-container">
              {/* <div className="profile-picture">
                <img src="" alt="profilePic" />
              </div> */}
              <div className="profile-stats">
                <h1> {user?.name}</h1>
                <h2>Win: {user?.win}</h2>
                <h2>Lose: {user?.lose}</h2>
              </div>
            </div>
            <div className="right-container">
              <div className="matchHistory">
                <div className="matchHistory-header">
                  <h1>Match History</h1>
                </div>
                <div className="matchHistory-content">
                  <ul>
                    {games &&
                      games.map((game: IGame, id: number) => (
                        <div
                          key={id}
                          className={"gamePlayed gamePlayed" + game.map}
                        >
                          <li key={id}>
                            <p>
                              {game.loginLP} {game.scoreLP} - {game.scoreRP} {game.loginRP}
                            </p>
                            <br />
                            <p>
                              {game.abort ? "game aborted by " + game.abort : null}
                            </p>
                          </li>
                        </div>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) || null}
    </div>
  );
}

export default ProfileDetails;
