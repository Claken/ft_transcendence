import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import TwoFa from "./pages/TwoFa";
import RequiredAuth from "./components/RequiredRoutes/RequiredAuth";
import RequiredOffline from "./components/RequiredRoutes/RequiredOffline";
import { useEffect, useRef } from "react";
import axios from "./axios.config";

function App() {

	const auth = useAuth();
	const isLogged = useRef(false);

	//TODO: doublon authContext 
	useEffect(() => {
		let subscribed = true;
		// GET session/cookie42
		axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				if (subscribed && res.data) {
					auth.setUser(res.data);
					isLogged.current = true;
					localStorage.setItem(
						"MY_PONG_APP",
						JSON.stringify(res.data)
					);
				}
			})
			.catch((error) => {
				console.log(error);
			});
		return () => {
			subscribed = false;
		};
	}, []);
	// 
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<Home />} />
						<Route path="*" element={<Home />} />
						<Route element={<RequiredOffline isLogged={isLogged}/>}>
							<Route path="/login" element={<Login />} />
							{/* <Route path="/Twofa" element={<TwoFa />} /> */}
						</Route>
						<Route element={<RequiredAuth isLogged={isLogged} />}>
							<Route path="/channel" element={<Channel />} />
							<Route path="/account" element={<Account />} />
							<Route path="/pong" element={<Pong />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
