
import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/user.interface";

import "../styles/page.css";

function Home() {
	const auth = useAuth();

	return (
		<div>
			<h1>Home</h1>
			<ul>
				<li>debut</li>
				{auth?.onlineUsers &&
					auth?.onlineUsers?.map((user: IUser) => (
						<li>{user?.name}</li>
					))}
				<li>fin</li>
			</ul>
		</div>
	);
}

export default Home;
