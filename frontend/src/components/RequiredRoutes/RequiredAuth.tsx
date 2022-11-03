import { Navigate, useLocation, Outlet } from "react-router-dom";

const RequiredAuth = ({ isLogged }) => {
	const location = useLocation();

	return isLogged ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default RequiredAuth;
