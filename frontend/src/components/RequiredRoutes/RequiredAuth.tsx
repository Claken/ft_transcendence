import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredAuth = () => {
	const location = useLocation();
	const { user } = useAuth();

	console.log(JSON.stringify(user));
	if (!user /*|| (user.isTwoFAEnabled && !user.isTwoFAValidated)*/)
		return  <Navigate to="/login" state={{ from: location }} replace />
	return <Outlet />
};

export default RequiredAuth;
