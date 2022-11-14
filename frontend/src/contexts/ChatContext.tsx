import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import { useAuth } from "./AuthContext";

const ChatContext = React.createContext(null);

export const ChatProvider = ({ children }) => {
	const auth = useAuth();
	const [target, setTarget] = useState<IUser>(null);
	const [haveTarget, setHaveTarget] = useState<boolean>(false);
	const [me, setMe] = useState<IUser>(auth.user);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setMe(auth.user);
	}, [auth.user]);

  const changeTarget = (user: IUser) => {
    setTarget(user);
    setHaveTarget(true);
    setLoading(true);
  };

	const deleteTarget = () => {
		setHaveTarget(false);
		setTarget(null);
	}

	return (
		<ChatContext.Provider
			value={{ me, target, haveTarget, loading, setLoading, changeTarget, deleteTarget}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	return useContext(ChatContext);
};