import React, { useEffect, useState } from "react";
import axios from "../../axios.config";
import { useDm } from "../../contexts/DmContext";
import { IUser } from "../../interfaces/user.interface";
import FriendButton from "./FriendButton";
import FriendRequestButton from "./FriendRequestButton";
import FriendSearch from "./FriendSearch";
import "../../styles/friend.css";
import PrRoomInviteButton from "./prRoomInviteButton";

function Friend() {
  const dmContext = useDm();
  const [friendRequests, setFriendRequests] = useState<IUser[]>([]);
  const [friends, setFriends] = useState<IUser[]>([]);
  const [prInvites, setPrInvites] = useState<{user: string, channel: string}[]>([]);

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

  const getPrInvites = async () => {
    await axios
      .get(`/privateRoomInvite/${dmContext.me.id}`)
      .then((res) => {
        setPrInvites(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendFriendRequest = (name: string) => {
    getFriendRequests();
  };

  const acceptFriendRequest = (name: string) => {
    getFriendRequests();
    getFriends();
  };

  const refuseFriendRequest = (name: string) => {
    getFriendRequests();
  };

  const deleteFriend = (name: string) => {
    getFriends();
  };

  const setPrivateRoomInvites = () => {
    getPrInvites();
  }

  useEffect(() => {
    getFriendRequests();
    getFriends();
    getPrInvites();

  }, []);

  useEffect(() => {
    dmContext.socket?.on("send_friendRequest", sendFriendRequest);
    return () => {
      dmContext.socket?.off("send_friendRequest", sendFriendRequest);
    };
  }, [sendFriendRequest, friendRequests]);

  useEffect(() => {
    dmContext.socket?.on("accept_friendRequest", acceptFriendRequest);
    return () => {
      dmContext.socket?.off("accept_friendRequest", acceptFriendRequest);
    };
  }, [acceptFriendRequest, friends, friendRequests]);

  useEffect(() => {
    dmContext.socket?.on("refuse_friendRequest", refuseFriendRequest);
    return () => {
      dmContext.socket?.off("refuse_friendRequest", refuseFriendRequest);
    };
  }, [refuseFriendRequest, friendRequests]);

  useEffect(() => {
    dmContext.socket?.on("delete_friend", deleteFriend);
    return () => {
      dmContext.socket?.off("delete_friend", deleteFriend);
    };
  }, [deleteFriend, friends]);

  useEffect(() => {
    dmContext.socket?.on("recvPrivateRoomInvite", setPrivateRoomInvites);
    return () => {
      dmContext.socket?.off("recvPrivateRoomInvite", setPrivateRoomInvites);
    };
  }, [setPrivateRoomInvites]);

  return (
    <ul className="friend-list">
      <li className="friendsearchbar">
        <FriendSearch changeFriends={setFriends} />
      </li>
      {friendRequests.map((friendRequest) => (
        <FriendRequestButton key={friendRequest.id} user={friendRequest} />
      ))}
       {prInvites.map((invite) => (
        <PrRoomInviteButton key={0} user={invite.user} channel={invite.channel} />
      ))}
      {friends.map((friend) => (
        <FriendButton key={friend.id} user={friend} />
      ))}
    </ul>
  );
}

export default Friend;
