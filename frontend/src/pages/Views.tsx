import React from 'react'
import Home from "./Home";
import Login from "./Login";
import Pong from "./Pong";
import Channel from "./Channel";
import Account from "./Account";
import { AuthProvider } from "../contexts/AuthContext";
import RequiredAuth from "../components/auth/RequiredAuth";
import RequiredOffline from "../components/auth/RequiredOffline";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Views = () => {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<Home />} />
					<Route element={<RequiredOffline />}>
						<Route path="/login" element={<Login />} />
					</Route>
					<Route element={<RequiredAuth />}>
						<Route path="/channel" element={<Channel />} />
						<Route path="/account" element={<Account />} />
						<Route path="/pong" element={<Pong />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default Views
