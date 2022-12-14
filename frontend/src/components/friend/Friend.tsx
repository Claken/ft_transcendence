import React, { useEffect, useState } from "react";
import axios from "../../axios.config";
import { useDm } from "../../contexts/DmContext";
import { IUser } from "../../interfaces/user.interface";
import FriendButton from "./FriendButton";
import FriendRequestButton from "./FriendRequestButton";
import FriendSearch from "./FriendSearch";
import "../../styles/friend.css";

function Friend() {
  const dmContext = useDm();
  const [friendRequests, setFriendRequests] = useState<IUser[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);

  const getFriendRequests = async () => {
    await axios
      .get(`/friendRequest/${dmContext.me.id}`)
      .then((res) => {
        setFriendRequests(res.data);
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

  const sendFriendRequest = () => {
    getFriendRequests();
  };

  const acceptFriendRequest = () => {
    getFriendRequests();
    getFriends();
  };

  const refuseFriendRequest = () => {
    getFriendRequests();
  };

  const deleteFriend = () => {
    getFriends();
  };

  const blockUserRefresh = () => {
    getFriends();
  }

  useEffect(() => {
    getFriendRequests();
    getFriends();
  }, [dmContext.setSocket]);

  useEffect(() => {
    getFriendRequests();
    getFriends();
  }, []);

  useEffect(() => {
    dmContext.socket?.on("send_friendRequest", sendFriendRequest);
    return () => {
      dmContext.socket?.off("send_friendRequest", sendFriendRequest);
    };
  }, [sendFriendRequest]);

  useEffect(() => {
    dmContext.socket?.on("accept_friendRequest", acceptFriendRequest);
    return () => {
      dmContext.socket?.off("accept_friendRequest", acceptFriendRequest);
    };
  }, [acceptFriendRequest]);

  useEffect(() => {
    dmContext.socket?.on("refuse_friendRequest", refuseFriendRequest);
    return () => {
      dmContext.socket?.off("refuse_friendRequest", refuseFriendRequest);
    };
  }, [refuseFriendRequest]);

  useEffect(() => {
    dmContext.socket?.on("delete_friend", deleteFriend);
    return () => {
      dmContext.socket?.off("delete_friend", deleteFriend);
    };
  }, [deleteFriend]);

  useEffect(() => {
    dmContext.socket?.on("block_user", blockUserRefresh);
    return () => {
      dmContext.socket?.off("block_user", blockUserRefresh);
    };
  }, [blockUserRefresh]);

  useEffect(() => {
    dmContext.socket?.on("deblock_user", blockUserRefresh);
    return () => {
      dmContext.socket?.off("deblock_user", blockUserRefresh);
    };
  }, [blockUserRefresh]);

  return (
    <ul className="friend-list">
      <li className="friendsearchbar">
        <FriendSearch changeFriends={setFriends} />
      </li>
      {friendRequests.map((friendRequest) => (
        <FriendRequestButton key={friendRequest.id} user={friendRequest} />
      ))}
      {friends.map((friend) => (
        <FriendButton key={friend.id} user={friend} />
      ))}
    </ul>
  );
}

export default Friend;
