import React from "react";
import Navigation from "../components/Navigation";
import "../styles/page.css";

function Register() {
  return (
    <div className="background">
      <Navigation />
      <div className="rectangle">
        <h1 className="register">Register</h1>
        <form className="items">
          <input className="input" type="text" placeholder="write your name" value=""></input>
          <input className="input" type="text" placeholder="write your password" value=""></input>
					<input className="input" type="text" placeholder="confirm your password" value=""></input>
        </form>
				<div className="blank"></div>
        <button className="btnconfirm">Register</button>
				<h1 className="register">Login</h1>
				<form className="items">
          <input className="input" type="text" placeholder="write your name" value=""></input>
          <input className="input" type="text" placeholder="write your password" value=""></input>
        </form>
				<div className="blank"></div>
        <button className="btnconfirm">Login</button>
      </div>
    </div>
  );
}

export default Register;
