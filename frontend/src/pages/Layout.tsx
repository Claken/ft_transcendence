// import axios from "../axios.config";//TODO: retirer car inutile ?
// import { useEffect } from "react";//TODO: retirer car inutile ?
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
// import { useAuth } from "../contexts/AuthContext";//TODO: retirer car inutile ?

const Layout = () => {
	return (
		<div className="background">
			<Navigation />
			<Outlet />
		</div>
	);
};

export default Layout;
