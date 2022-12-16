import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Game from "./components/game/Game";
import Social from "./pages/Social";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { DmProvider } from "./contexts/DmContext";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";
import RequiredOffline from "./components/RequiredRoutes/RequiredOffline";
import LayoutPong from "./pages/LayoutPong";
import RequiredAuth from "./components/RequiredRoutes/RequiredAuth";
import TwoFaConnexion from "./pages/TwoFaConnexion";

function App() {
	return (
		<AuthProvider>
			<DmProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Layout />}>
							{/* todo: refresh amene sur la page Home, comportement voulu ? */}
							<Route index element={<Home />} />
							<Route path="*" element={<Pong />} />
							<Route element={<RequiredOffline />}>
								<Route path="/login" element={<Login />} />
							</Route>
							<Route element={<RequiredAuth />}>
								<Route path="/account" element={<Account />} />
								<Route path="/social" element={<Social />} />
								<Route path="/channel" element={<Channel />} />
								<Route path="/pong" element={<LayoutPong />}>
									<Route index element={<Pong />} />
									<Route path=":gameId" element={<Game />} />
								</Route>
								<Route path="/profile" element={<Profile />} />
								<Route
									path="profile/:userId"
									element={<ProfileDetails />}
								/>
							</Route>
							{/* pim la page */}
							<Route
								path="twofa-validation"
								element={<TwoFaConnexion />}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</DmProvider>
		</AuthProvider>
	);
}

export default App;
