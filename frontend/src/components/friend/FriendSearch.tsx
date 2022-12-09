import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { IUser } from "../../interfaces/user.interface";
import { useDm } from "../../contexts/DmContext";
import "../../styles/dmchat.css";

function FriendSearch(props) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [friends, setFriends] = useState<IUser[]>([]);
	const dmContext = useDm();

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`/users/${dmContext.me.name}/friends`)
        .then((res) => {
          setFriends(res.data);
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
    props.changeFriends(friends.filter((friend) => !friend.name.search(input)));
  };

  return (
    <div className="bodysearchinput">
      <input className="searchinput"
        type="text"
        placeholder="search friends..."
        value={searchInput}
        onChange={modifyDmInput}
      ></input>
    </div>
  );
}

export default FriendSearch;