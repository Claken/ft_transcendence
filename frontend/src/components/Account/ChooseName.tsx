/* eslint-disable react-hooks/exhaustive-deps */
import axios from "../../axios.config";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IUser } from "../../interfaces/user.interface";
import { socket } from "../Socket";

const ChooseName = ({}) => {
	const { user, setUser } = useAuth();
	const [input, setInput] = useState<string>("");
	const [isNameFree, setIsNameFree] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.currentTarget.value);
	};

	useEffect(() => {
		if (isNameFree) {
			setUser((prev: IUser) => ({ ...prev, name: input }));
			socket.emit("update-username", { newName: input, userId: user.id });
			setInput('');
			setIsNameFree(false);
		}
	}, [isNameFree]);

	const isAlpha = (input: string) => {
		for (let index = 0; index < input.length; index++) {
			const element = input.charCodeAt(index);
			if (element < 48 || element > 122)
				return false
		}
		return true
	}

	const handleClick = () => {
		const getUserByName = async () => {
			await axios
				.get("/users/name/" + input)
				.then((res) => {
					if (!res.data) setIsNameFree(true);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		if (input && input.length <= 10 && isAlpha(input))
			getUserByName();
	};

	const focus = () => {
		inputRef.current.focus();
	}

	return (
		user.inGame || user.inQueue || user.hasSentAnInvite ? null :
		<div className="username-settings">
			<h2><button onClick={focus}>{user?.name}</button></h2>
			<input ref={inputRef} type="text" className="input" onChange={handleChange} placeholder="Change Username" />
			<button className="btnconfirm" onClick={handleClick}>
				Submit
			</button>
		</div>
	);
};

export default ChooseName;
