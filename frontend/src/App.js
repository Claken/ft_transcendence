import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Pong from "./pages/Pong.tsx";
import Channel from "./pages/Channel.tsx";
import Account from "./pages/Account.tsx";
import LogContext from "./contexts/LogContext";

function App() {
  const [isLog, setIsLog] = useState(false);

  const contextValue = {
    isLog,
    setIsLog,
  };

  return (
    <LogContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/account" element={<Account />} />
          <Route path="/pong" element={<Pong />} />
        </Routes>
      </BrowserRouter>
    </LogContext.Provider>
  );
}

export default App;
