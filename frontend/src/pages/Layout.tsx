import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

const Layout = () => {
	return (
		<div className="background">
			<Navigation />
			<Outlet />
		</div>
	);
};

export default Layout;
