import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Pong from "./pages/Pong";
import Channel from "./pages/Channel";
import Account from "./pages/Account";
import Error404 from "./pages/Error404";
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
          <Route path="*" element={<Error404 />} />
          <Route path="/channel" element={ isLog ? <Channel /> : <Navigate to="/login" />} />
          <Route path="/account" element={ isLog ? <Account /> : <Navigate to="/login" />} />
          <Route path="/pong" element={ isLog ? <Pong /> : <Navigate to="/login" />} />
        </Routes>
      </LogContext.Provider>    
    </BrowserRouter>
  );
}

export default App;
