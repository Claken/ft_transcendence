import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredAuth = () => {
	const auth = useAuth();

	return auth.user ? (
		<Outlet />
	) : (		
		<Navigate to="/login" />
	);
};

export default RequiredAuth;
