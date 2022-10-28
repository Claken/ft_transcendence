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
import WaitingRoom from "./components/game/WaitingRoom";

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
							{/* <Route element={<RequiredGameInstance />}> */}
							<Route path="/pong" >
								<Route index element={<Pong />} />
								<Route path="matchmaking" element={<h1>Matchmaking</h1>} />
								<Route path="waitingRoom" element={<WaitingRoom />} />
								<Route path=":gameId" element={<Game />} />
							</Route>
							{/* </Route> */}
						</Route>
						
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
