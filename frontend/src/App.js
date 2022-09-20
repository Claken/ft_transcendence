import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home.tsx";
import Register from "./pages/Register.tsx";
import Pong from "./pages/Pong.tsx";
import Channel from "./pages/Channel.tsx";
import Account from "./pages/Account.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/channel" element={<Channel />} />
        <Route path="/account" element={<Account />} />
        <Route path="/pong" element={<Pong />} />
        <Route path="/" element={<Home />} />
				<Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
