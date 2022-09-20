import React from "react";
import Navigation from "../components/Navigation.tsx";
import RegisterForm from "../components/RegisterForm.tsx"
import LoginForm from "../components/LoginForm.tsx"
import "../styles/page.css";

function Register() {
  return (
    <div className="background">
      <Navigation />
      <div className="rectangle">
				<RegisterForm />
				<LoginForm />
      </div>
    </div>
  );
}

export default Register;
