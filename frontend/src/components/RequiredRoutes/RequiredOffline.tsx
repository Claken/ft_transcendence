import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredOffline = () => {
	const location = useLocation();
	const auth = useAuth();

	return !auth?.user ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default RequiredOffline;
