import React, { useState, useContext} from "react";
import LogContext from "../contexts/LogContext";
import "../styles/page.css";

function GuestForm() {
  const [guestInput, setGuestInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {isLog, setIsLog} = useContext(LogContext);

  const modifyGuestInput = (event) => {
    const input = event.currentTarget.value;
    setGuestInput(input);
  };

  const guestClient = (event) => {
    event.preventDefault();
    setErrorMsg("");
    if (guestInput === "") setErrorMsg("you need to write a name");
    else {
      setGuestInput("");
      setIsLog(true);
    }
  };

  return (
    <div>
      <h1 className="login">Play as guest</h1>
      <form className="items" onSubmit={guestClient}>
        <input
          className="input"
          type="text"
          placeholder="write your name"
          value={guestInput}
          onChange={modifyGuestInput}
        ></input>
      </form>
      <div className="blank">{errorMsg}</div>
      <button className="btnconfirm" onClick={guestClient}>
        become a guest
      </button>
    </div>
  );
}

export default GuestForm;
