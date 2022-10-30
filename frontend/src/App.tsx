import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Game from "./components/game/Game";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import RequiredAuth from "./components/auth/RequiredAuth";
// import RequiredGameInstance from "./components/auth/RequiredGameInstance";
import RequiredOffline from "./components/auth/RequiredOffline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LayoutPong from "./pages/LayoutPong";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
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
							{/* <Route element={<RequiredGameInstance />}> */}
							<Route path="/pong" element={<LayoutPong />}>
								<Route index element={<Pong />} />
								<Route path=":gameId" element={<Game />} />
							</Route>
							{/* </Route> */}
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
