import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/user.interface";
import "../styles/page.css";

function Home() {
	const auth = useAuth();

	// let users = auth.users.map((user: IUser, id: number) => (
	// 	<li key={user.id}>{user.name}</li>
	// ));

	return (
		<div className="background">
			<Navigation />
			<h1>Home</h1>
			{/* <ul>{auth.users ? users : null}</ul> */}
		</div>
	);
}

export default Home;
