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
    <BrowserRouter>
      <LogContext.Provider value={contextValue}>
        <Routes>
          <Route path="/login" element={ isLog ? <Navigate to="/account" /> : <Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
          <Route path="/channel" element={ isLog ? <Channel /> : <Navigate to="/login" />} />
          <Route path="/account" element={ isLog ? <Account /> : <Navigate to="/login" />} />
          <Route path="/pong" element={ isLog ? <Pong /> : <Navigate to="/login" />} />
        </Routes>
      </LogContext.Provider>    
    </BrowserRouter>
  );
}

export default App;
