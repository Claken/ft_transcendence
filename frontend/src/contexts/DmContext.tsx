import React, { useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { IUser } from "../interfaces/user.interface";
import { useAuth } from "./AuthContext";

const DmContext = React.createContext(null);

export const DmProvider = ({ children }) => {
  const auth = useAuth();
  const [target, setTarget] = useState<IUser>();
  const [haveTarget, setHaveTarget] = useState<boolean>(false);
  const [me, setMe] = useState<IUser>(auth.user);
  const [socket, setSocket] = useState<Socket>(null);
  const [loading, setLoading] = useState<boolean>(false);  
	const [friendNotif, setFriendNotif] = useState(false);

  const sendFriendRequest = () => {
    setFriendNotif(true);
  };

  useEffect(() => {
    socket?.on("send_friendRequest", sendFriendRequest);
    return () => {
      socket?.off("send_friendRequest", sendFriendRequest);
    };
  }, [sendFriendRequest]);

  useEffect(() => {
    socket?.on("recvPrivateRoomInvite", sendFriendRequest);
    return () => {
      socket?.off("recvPrivateRoomInvite", sendFriendRequest);
    };
  }, [sendFriendRequest]);

  useEffect(() => {
    setMe(auth.user);
  }, [auth.user]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    if (me && socket)
      socket.emit("join_dm", {
        sender: me.name,
        receiver: me.name,
      });
  }, [me, socket]);

  const changeTarget = (user: IUser) => {
    setTarget(user);
    setHaveTarget(true);
    setLoading(true);
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
      }}
    >
      {children}
    </DmContext.Provider>
  );
};

export const useDm = () => {
  return useContext(DmContext);
};
