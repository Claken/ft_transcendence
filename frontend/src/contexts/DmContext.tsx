import React, { useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { IUser } from "../interfaces/user.interface";
import axios from "../axios.config";
import { useAuth } from "./AuthContext";

const DmContext = React.createContext(null);

export const DmProvider = ({ children }) => {
  const auth = useAuth();
  const [target, setTarget] = useState<IUser>();
  const [haveTarget, setHaveTarget] = useState<boolean>(false);
  const [me, setMe] = useState<IUser>(auth.user);
  const [socket, setSocket] = useState<Socket>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [friendNotif, setFriendNotif] = useState<boolean>(false);
  const [blockUsers, setBlockUsers] = useState<IUser[]>([]);
  const [blockBys, setBlockBys] = useState<IUser[]>([]);

  const sendFriendRequest = () => {
    setFriendNotif(true);
  };

  const getBlockUsers = async () => {
    await axios
      .get(`/blockUser/${me.name}/blockUsers`)
      .then((res) => {
        setBlockUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBlockBys = async () => {
    await axios
      .get(`/blockUser/${me.name}/blockBys`)
      .then((res) => {
        setBlockBys(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const blockRefresh = () => {
    getBlockUsers();
    getBlockBys();
    console.log("all block users:");
    blockUsers.map((blockUser) => console.log(blockUser.name));
    console.log("|end");
  };

  useEffect(() => {
    socket?.on("send_friendRequest", sendFriendRequest);
    return () => {
      socket?.off("send_friendRequest", sendFriendRequest);
    };
  }, [sendFriendRequest]);

  useEffect(() => {
    socket?.on("block_user", blockRefresh);
    return () => {
      socket?.off("block_user", blockRefresh);
    };
  }, [blockRefresh]);

  useEffect(() => {
    socket?.on("deblock_user", blockRefresh);
    return () => {
      socket?.off("deblock_user", blockRefresh);
    };
  }, [blockRefresh]);

  useEffect(() => {
    setMe(auth.user);
  }, [auth.user]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    if (me && socket) {
      console.log("new socket")
      socket.emit("join_dm", {
        sender: me.name,
        receiver: me.name,
      });
      getBlockUsers();
      getBlockBys();
    }
  }, [me, setSocket]);

  const changeTarget = (user: IUser) => {
    setTarget(user);
    setHaveTarget(true);
    setLoading(true);
  };

  const isBlock = (id: number) => {
    if (blockUsers.findIndex((blockUser) => blockUser.id === id) > -1)
      return true;
    return false;
  };

  const isBlocked = (id: number) => {
    if (blockBys.findIndex((blockBy) => blockBy.id === id) > -1) return true;
    return false;
  };

  return (
    <DmContext.Provider
      value={{
        me,
        socket,
        target,
        setTarget,
        haveTarget,
        setHaveTarget,
        loading,
        setLoading,
        changeTarget,
        friendNotif,
        setFriendNotif,
        blockUsers,
        blockBys,
        isBlock,
        isBlocked,
      }}
    >
      {children}
    </DmContext.Provider>
  );
};

export const useDm = () => {
  return useContext(DmContext);
};
