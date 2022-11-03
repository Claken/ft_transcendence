import { Navigate, useLocation, Outlet } from "react-router-dom";

const RequiredOffline = ({ isLogged }) => {
	const location = useLocation();

	return !isLogged ? (
		<Navigate to="/" state={{ from: location }} replace />
	) : (
		<Outlet />
	);
};

export default RequiredOffline;
