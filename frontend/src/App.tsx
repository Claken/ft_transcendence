import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import RequiredAuth from "./components/auth/RequiredAuth";
import RequiredOffline from "./components/auth/RequiredOffline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="*" element={<Home />} />
						<Route element={<RequiredOffline />}>
							<Route path="/login" element={<Login />} />
						</Route>
						<Route element={<RequiredAuth />}>
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
