import React, { useState } from "react";
import "../styles/page.css";

function LoginForm() {
  const [loginInput, setLoginInput] = useState("");
  const [loginPassInput, setLoginPassInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const modifyLoginInput = (event) => {
    const input = event.currentTarget.value;
    setLoginInput(input);
  };

  const modifyLoginPassInput = (event) => {
    const input = event.currentTarget.value;
    setLoginPassInput(input);
  };

  const loginClient = (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (loginInput === "") setErrorMsg("you need to write your name");
    else if (loginPassInput === "")
      setErrorMsg("you need to write your password");
    else {
      setLoginInput("");
      setLoginPassInput("");
    }
  };

  return (
    <div>
      <h1 className="register">Login</h1>
      <form className="items" onSubmit={loginClient}>
        <input
          className="input"
          type="text"
          placeholder="write your name"
          value={loginInput}
          onChange={modifyLoginInput}
        ></input>
      </form>
      <form className="items" onSubmit={loginClient}>
        <input
          className="input"
          type="password"
          placeholder="write your password"
          value={loginPassInput}
          onChange={modifyLoginPassInput}
        ></input>
      </form>
      <div className="blank">{errorMsg}</div>
      <button className="btnconfirm" onClick={loginClient}>
        Login
      </button>
    </div>
  );
}

export default LoginForm;
