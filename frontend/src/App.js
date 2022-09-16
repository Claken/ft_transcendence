import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Pong from "./pages/Pong";
import Channel from "./pages/Channel";
import Account from "./pages/Account";

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
