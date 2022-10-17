import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredOffline = () => {
	const location = useLocation();
	const auth = useAuth();

	if (auth?.user)
	    return <Navigate to="/home" state={{ from: location }} replace />
	return <Outlet/>;
};

export default RequiredOffline;
