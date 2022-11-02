import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import DmChat from "./DmChat";
import { IUser } from "../../interfaces/user.interface";
import "../../styles/dmchat.css";

function DmList() {
  const [Users, setUsers] = useState<IUser[]>([]);
  const [IdUser, setIdUser] = useState(0);
  const [ShowDm, setShowDm] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const getData = async () => {
      const res = await axios("http://localhost:3001/users");
      setUsers(res.data);
    };
    getData();
  }, []);

  const Show = (id: number) => {
    setIdUser(id);
    setShowDm(true);
  };

  return (
    <div>
      <ul>
        {Users.map((user) =>
          ShowDm
            ? user.id === IdUser && <DmChat key={user.id} user={user} />
            : user.status === "online"
            ? auth.user.name !== user.name && (
                <li key={user.id}>
                  <button className="btn" onClick={() => Show(user.id)}>
                    <div className="cercleconnect">{user.name}</div>
                  </button>
                </li>
              )
            : auth.user.name !== user.name && (
                <li key={user.id}>
                  <button className="btn" onClick={() => Show(user.id)}>
									<div className="cercledisconnect">{user.name}</div>
                  </button>
                </li>
              )
        )}
      </ul>
    </div>
  );
}

export default DmList;
