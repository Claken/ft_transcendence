import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { useChat } from "../../contexts/ChatContext";
import DmUserButton from "./DmUserButton";
import { IUser } from "../../interfaces/user.interface";
import DmSearch from "./DmSearch";
import "../../styles/dmchat.css";
import "../../styles/social.css";

function DmList() {
  const [Users, setUsers] = useState<IUser[]>([]);
  const chat = useChat();

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
  }, []);

  const isMe = (id): boolean => {
    if (id === chat.me.id) return true;
    return false;
  };

  const changeUsers = (users: IUser[]) => {
    setUsers(users);
  };

  const changeTarget = (user: IUser) => {
    chat.setTarget(user);
    chat.setHaveTarget(true);
    chat.setLoading(true);
  };

  return (
    <ul className="btndisplay">
      <li className="dmsearchbar">
        <DmSearch changeUsers={changeUsers} />
      </li>
      {Users.map(
        (user) =>
          !isMe(user.id) && (
            <DmUserButton
              key={user.id}
              user={user}
              changeTarget={changeTarget}
            />
          )
      )}
    </ul>
  );
}

export default DmList;
