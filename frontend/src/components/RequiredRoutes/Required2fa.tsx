import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Required2fa = () => {
	const location = useLocation();
	const { user } = useAuth();

	if (user && user.isTwoFAEnabled && !user.isTwoFAValidated)
		return <Outlet />
	return <Navigate to="/" state={{ from: location }} replace />
};

export default Required2fa