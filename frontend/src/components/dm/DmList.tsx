import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { useChat } from "../../contexts/ChatContext";
import DmChat from "./DmChat";
import DmUserButton from "./DmUserButton";
import { IUser } from "../../interfaces/user.interface";
import DmSearch from "./DmSearch";
import "../../styles/dmchat.css";

function DmList() {
  const [Users, setUsers] = useState<IUser[]>([]);
  const [ShowDm, setShowDm] = useState(false);
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

  const Show = (user: IUser) => {
    chat.changeDm(user);
    setShowDm(true);
  };

  return (
    <div>
      {ShowDm ? (
        <DmChat />
      ) : (
				<div className="">
					<DmSearch changeUsers={setUsers} />
        	<ul>
        	  {Users.map(
        	    (user) =>
        	      !isMe(user.id) && (
        	        <DmUserButton key={user.id} user={user} show={Show} />
        	      )
        	  )}
        	</ul>
				</div>
      )}
    </div>
  );
}

export default DmList;
