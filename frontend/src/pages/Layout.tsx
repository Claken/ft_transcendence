import axios from "../axios.config";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
	const auth = useAuth();
	const [isloading, setIsloading] = useState<boolean>(true);

	const getUserByname = async (name: string) => {
		await axios
			.get("/users/" + name)
			.then((res) => {
				if (res.data) {
					auth.setUser(null);
					auth.setUser(res.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	useEffect(() => {
		const token = localStorage.getItem("MY_PONG_APP");
		if (isloading && token) {
			const { name } = JSON.parse(token);
			getUserByname(name);
			setIsloading(false);
		}
	}, []);

	return (
		<div className="background">
			<Navigation />
			<Outlet />
		</div>
	);
};

export default Layout;
