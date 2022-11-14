import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Social from "./pages/Social";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import RequiredAuth from "./components/auth/RequiredAuth";
import RequiredOffline from "./components/auth/RequiredOffline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { ChatProvider } from "./contexts/ChatContext";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="*" element={<Home />} />
              <Route element={<RequiredOffline />}>
                <Route path="/login" element={<Login />} />
              </Route>
              {/* <Route element={<RequiredAuth />}> */}
                <Route path="/account" element={<Account />} />
                <Route path="/social" element={<Social />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/pong" element={<Pong />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="profile/:userId" element={<ProfileDetails />} />
              {/* </Route> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
