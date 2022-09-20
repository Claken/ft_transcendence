import React, { useState } from "react";
import "../styles/page.css";

function RegisterForm() {
  const [registerInput, setRegisterInput] = useState("");
  const [registerPassInput, setRegisterPassInput] = useState("");
  const [registerPassConfirmInput, setRegisterPassConfirmInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const modifyRegisterInput = (event) => {
    const input = event.currentTarget.value;
    setRegisterInput(input);
  };

  const modifyRegisterPassInput = (event) => {
    const input = event.currentTarget.value;
    setRegisterPassInput(input);
  };

  const modifyRegisterPassConfirmInput = (event) => {
    const input = event.currentTarget.value;
    setRegisterPassConfirmInput(input);
  };

  const registerClient = (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (registerInput === "") setErrorMsg("you need to write a name");
    else if (registerPassInput === "")
      setErrorMsg("you need to write a password");
    else if (registerPassConfirmInput == "")
      setErrorMsg("you need to confirm your password");
    else if (registerPassInput !== registerPassConfirmInput)
      setErrorMsg("passwords are not the same");
    else {
      setRegisterInput("");
      setRegisterPassInput("");
      setRegisterPassConfirmInput("");
    }
  };

  return (
    <div>
      <h1 className="register">Register</h1>
      <form className="items" onSubmit={registerClient}>
        <input
          className="input"
          type="text"
          placeholder="write your name"
          value={registerInput}
          onChange={modifyRegisterInput}
        ></input>
      </form>
      <form className="items" onSubmit={registerClient}>
        <input
          className="input"
          type="password"
          placeholder="write your password"
          value={registerPassInput}
          onChange={modifyRegisterPassInput}
        ></input>
      </form>
      <form className="items" onSubmit={registerClient}>
        <input
          className="input"
          type="password"
          placeholder="confirm your password"
          value={registerPassConfirmInput}
          onChange={modifyRegisterPassConfirmInput}
        ></input>
      </form>
      <div className="blank">{errorMsg}</div>
      <button className="btnconfirm" onClick={registerClient}>
        Register
      </button>
    </div>
  );
}

export default RegisterForm;
