import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/user.interface";

import "../styles/page.css";

function Home() {
	const auth = useAuth();


	return (
		<div>
			<h1>Home</h1>
			<ul>
				<li>auth.user : | {auth?.user?.name} | </li>
				<li>__ List Users __</li>
				{auth?.users &&
					auth?.users?.map((user: IUser) => (
						<li key={user.id}>
							{user?.name} : {user?.status}
						</li>
					))}
			</ul>
		</div>
	);
}

export default Home;
