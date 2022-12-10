import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredAuth = () => {
	const location = useLocation();
	const { user } = useAuth();

	if (
		user &&
		(!user.isTwoFAEnabled || (user.isTwoFAEnabled && user.isTwoFAValidated))
	)
		return <Outlet />;
	return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequiredAuth;