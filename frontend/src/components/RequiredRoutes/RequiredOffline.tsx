import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredOffline = () => {
	const location = useLocation();
	const { user } = useAuth();

	return !user ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default RequiredOffline;
