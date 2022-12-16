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
  const [me, setMe] = useState<IUser>(null);
  const [socket, setSocket] = useState<Socket>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [blockUsers, setBlockUsers] = useState<IUser[]>([]);
  const [blockBys, setBlockBys] = useState<IUser[]>([]);

  const getBlockUsers = async () => {
    await axios
      .get(`/blockUser/${me.id}/blockUsers`)
      .then((res) => {
        setBlockUsers(res.data);
        if (blockUsers === undefined) setBlockUsers([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getBlockBys = async () => {
    await axios
      .get(`/blockUser/${me.id}/blockBys`)
      .then((res) => {
        setBlockBys(res.data);
        if (blockBys === undefined) setBlockBys([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const blockRefresh = () => {
    getBlockUsers();
    getBlockBys();
  };

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
      console.log("new socket connect " + me.name);
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
    if (
      blockUsers !== undefined &&
      blockUsers.findIndex((blockUser) => blockUser.id === id) > -1
    )
      return true;
    return false;
  };

  const isBlocked = (id: number) => {
    if (
      blockBys !== undefined &&
      blockBys.findIndex((blockBy) => blockBy.id === id) > -1
    )
      return true;
    return false;
  };

  const isBlockedName = (name: string) => {
    if (
      blockBys !== undefined &&
      blockBys.findIndex((blockBy) => blockBy.name === name) > -1
    )
      return true;
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
