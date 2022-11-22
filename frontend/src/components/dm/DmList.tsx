import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { useDm } from "../../contexts/DmContext";
import DmUserButton from "./DmUserButton";
import { IUser } from "../../interfaces/user.interface";
import DmSearch from "./DmSearch";
import "../../styles/dmchat.css";
import "../../styles/social.css";

function DmList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const dmContext = useDm();

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
    if (id === dmContext.me.id) return true;
    return false;
  };

  return (
    <ul className="btndisplay">
      <li className="dmsearchbar">
        <DmSearch changeUsers={setUsers} />
      </li>
      {users.map(
        (user) => !isMe(user.id) && <DmUserButton key={user.id} user={user} />
      )}
    </ul>
  );
}

export default DmList;
