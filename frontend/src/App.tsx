import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import { RequiredAuth } from "./components/RequiredAuth";

function App() {


	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
          			<Route path="*" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/channel" element={<RequiredAuth><Channel /></RequiredAuth>} />
					<Route path="/account" element={<RequiredAuth><Account /></RequiredAuth>} />
					<Route path="/pong" element={<RequiredAuth><Pong /></RequiredAuth>} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
