import { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const RequiredAuth = () => {
	const location = useLocation();
	const auth = useAuth();

	return auth.user ? (
		<Outlet />
	) : (		
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default RequiredAuth;
