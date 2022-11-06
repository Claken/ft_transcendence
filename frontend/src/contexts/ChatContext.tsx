import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import { useAuth } from "./AuthContext";

const ChatContext = React.createContext(null);

export const ChatProvider = ({ children }) => {
	const auth = useAuth();
	const [toChat, setToChat] = useState<IUser>();
	const [me, setMe] = useState<IUser>(auth.user);

	useEffect(() => {
		setMe(auth.user);
	}, [auth.user]);

	const changeDm = (user: IUser) => {
		setToChat(user);
	};

	return (
		<ChatContext.Provider
			value={{ me, toChat, changeDm }}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	return useContext(ChatContext);
};