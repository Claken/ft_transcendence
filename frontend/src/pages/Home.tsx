import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/user.interface";
import axios from '../axios.config'

import "../styles/page.css";

function Home() {
	const auth = useAuth();

	// const listUsers = auth?.users.map((user: IUser, index) => (
	// 	<li key={index}>
	// 		{auth.user?.name} : {auth.user?.status}
	// 	</li>
	// ));
	// useEffect(() => {
	// 	axios.
	// }, [])

	return (
		<div>
			<h1>Home</h1>
			<ul>
				<li>users length : | {auth?.users?.length} | </li>
				<li>__ List Users __</li>
				{/* {listUsers} */}
			</ul>
		</div>
	);
}

export default Home;
