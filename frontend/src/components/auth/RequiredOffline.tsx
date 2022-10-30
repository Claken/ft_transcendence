import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredOffline = () => {
	const auth = useAuth();

	return auth.user ? (
		<Navigate to="/" />
	) : (
		<Outlet />
	);
};

export default RequiredOffline;
