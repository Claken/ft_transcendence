import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { useDm } from "../../contexts/DmContext";
import DmUserButton from "./DmUserButton";
import { IUser } from "../../interfaces/user.interface";
import DmSearch from "./DmSearch";
import "../../styles/dmchat.css";
import "../../styles/social.css";
import FriendButton from "../friend/FriendButton";

function DmList() {
  const dmContext = useDm();
  const [users, setUsers] = useState<IUser[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);

  const getUsers = async () => {
    await axios
      .get("/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFriends = async () => {
    await axios
      .get(`/users/${dmContext.me.name}/friends`)
      .then((res) => {
        setFriends(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUsers();
    getFriends();
  }, [dmContext.setSocket]);

  useEffect(() => {
    getUsers();
    getFriends();
  }, []);

  const acceptFriendRequest = () => {
    getUsers();
    getFriends();
  };

  const deleteFriend = () => {
    getUsers();
    getFriends();
  };

  useEffect(() => {
    dmContext.socket?.on("accept_friendRequest", acceptFriendRequest);
    return () => {
      dmContext.socket?.off("accept_friendRequest", acceptFriendRequest);
    };
  }, [acceptFriendRequest]);

  useEffect(() => {
    dmContext.socket?.on("delete_friend", deleteFriend);
    return () => {
      dmContext.socket?.off("delete_friend", deleteFriend);
    };
  }, [deleteFriend]);

  const reloadPage = () => {
    getUsers();
    getFriends();
  }

  useEffect(() => {
    dmContext.socket?.on("reload_user", reloadPage);
    return () => {
      dmContext.socket?.off("reload_user", reloadPage);
    };
  }, [reloadPage]);

  const isMe = (id: number): boolean => {
    if (id === dmContext.me.id) return true;
    return false;
  };

  const isConnect = (user: IUser): boolean => {
    if (user.status === "online") return true;
    return false;
  };

  const isFriend = (name: string): boolean => {
    const i = friends.findIndex((friend) => friend.name === name);
    if (i === -1) return false;
    return true;
  };

  return (
    <ul className="btndisplay">
      <li className="dmsearchbar">
        <DmSearch changeUsers={setUsers} />
      </li>
      {users.map(
        (user) =>
          !isMe(user.id) &&
          ((isFriend(user.name) && (
            <FriendButton key={user.id} user={user} />
          )) ||
            (isConnect(user) && <DmUserButton key={user.id} user={user} />))
      )}
    </ul>
  );
}

export default DmList;
