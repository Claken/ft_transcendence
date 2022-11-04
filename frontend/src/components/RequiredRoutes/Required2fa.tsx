import { Navigate, useLocation, Outlet } from "react-router-dom";

const Required2fa = ({ isTwofaEnabled }) => {
	const location = useLocation();

	return isTwofaEnabled.current ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default Required2fa