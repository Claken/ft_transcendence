import React, { useContext } from "react";
import { Navigate, Route } from "react-router-dom";

const AuthenticatedRoute = ({ path, element }) => {
	const isLog = 10;

	return isLog ? (
		<Route path={path} element={element} />
	) : (
		<Route path={path} element={<Navigate to="/login" />} />
	);
};

export default AuthenticatedRoute;
