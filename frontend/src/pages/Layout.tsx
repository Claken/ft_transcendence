import axios from "../axios.config";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
	return (
		<div className="background">
			<Navigation />
			<Outlet />
		</div>
	);
};

export default Layout;
