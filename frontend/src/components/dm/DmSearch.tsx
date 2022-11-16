import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { IUser } from "../../interfaces/user.interface";
import "../../styles/dmchat.css";

function DmSearch(props) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("/users")
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getData();
  }, [searchInput]);

  const modifyDmInput = (event) => {
    const input = event.currentTarget.value;
    setSearchInput(input);
    props.changeUsers(users.filter((user) => !user.name.search(input)));
  };

  return (
    <div className="bodysearchinput">
      <input className="searchinput"
        type="text"
        placeholder="search players..."
        value={searchInput}
        onChange={modifyDmInput}
      ></input>
    </div>
  );
}

export default DmSearch;
