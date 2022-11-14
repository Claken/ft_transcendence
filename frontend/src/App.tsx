import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Game from "./components/game/Game";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import TwoFa from "./pages/TwoFa";
import RequiredAuth from "./components/RequiredRoutes/RequiredAuth";
import RequiredOffline from "./components/RequiredRoutes/RequiredOffline";


function App() {

	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route path="/" element={<Home />} />
						<Route path="*" element={<Home />} />
						{/* <Route element={<RequiredOffline />}> */}
							<Route path="login" element={<Login />} />
						{/* </Route> */}
						{/* <Route element={<RequiredAuth />}> */}
							<Route path="channel" element={<Channel />} />
							<Route path="account" element={<Account />} />
							<Route path="pong" element={<Pong />} />
						{/* </Route> */}
						{/* <Route element={<Required2fa />}> */}
							<Route path="twofa" element={<TwoFa />} />
						{/* </Route> */}
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
