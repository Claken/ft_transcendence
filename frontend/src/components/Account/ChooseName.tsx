/* eslint-disable react-hooks/exhaustive-deps */
import axios from "../../axios.config";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IUser } from "../../interfaces/user.interface";
import { socket } from "../Socket";

const ChooseName = () => {
	const { user, setUser } = useAuth();
	const [input, setInput] = useState<string>("");
	const [freeName, setFreeName] = useState<boolean>(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.currentTarget.value);
	};

	useEffect(() => {
		if (freeName) {
			setUser((prev: IUser) => ({ ...prev, name: input }));
			socket.emit("update-username", { newName: input, userId: user.id });
		}
	}, [freeName]);

	const handleClick = () => {
		const getUserByName = async () => {
			await axios
				.get("/users/name/" + user.name)
				.then((res) => {
					if (res.data) setFreeName(true);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		if (input) getUserByName();
	};

	return (
		<div>
			<input type="text" onChange={handleChange} />
			<button className="btnconfirm" onClick={handleClick}>
				Change Username
			</button>
		</div>
	);
};

export default ChooseName;
