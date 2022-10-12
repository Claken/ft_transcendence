import React from "react";
import Navigation from "../components/Navigation";
import GuestForm from "../components/GuestForm";
import LoginForm from "../components/LoginForm";
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
