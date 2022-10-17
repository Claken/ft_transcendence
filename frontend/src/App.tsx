import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import RequiredAuth from "./components/auth/RequiredAuth";
import RequiredOffline from "./components/auth/RequiredOffline";

function App() {
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
	);
}

export default App;
