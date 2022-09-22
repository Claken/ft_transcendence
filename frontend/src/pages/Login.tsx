import React from "react";
import Navigation from "../components/Navigation.tsx";
import GuestForm from "../components/GuestForm.tsx";
import LoginForm from "../components/LoginForm.tsx";
import "../styles/page.css";

function Login() {
  return (
    <div className="background">
      <Navigation />
      <div className="rectanglelog">
        <LoginForm />
      </div>
      <div className="blank"></div>
      <div className="rectangleguest">
        <GuestForm />
      </div>
    </div>
  );
}

export default Login;
