import React, { useState, useEffect, useRef } from "react";
import useModal from "../hooks/useModal";
import io, { Socket } from "socket.io-client";
import { isForOfStatement } from "typescript";
import { IChatRoom } from "../../interfaces/chat.interface";
import { useAuth } from "../../contexts/AuthContext";
import { IMessageToBack } from "../../interfaces/messageToBack.interface";
import { IRoom } from "../../interfaces/room.interface";
import { type } from "../../interfaces/enum";
import "../../styles/chat.scss";
import RoomUserList from "./RoomUserList";
import { useNavigate } from "react-router-dom";
import GameInviteButton from "./GameInviteButton";
import CancelInviteButton from "./CancelInviteButton";
import JoinInviteButton from "./JoinInviteButton";
import RoomSettings from "./RoomSettings";
import { useDm } from "../../contexts/DmContext";
import { IUser } from "../../interfaces/user.interface";
import RoomsList from "./RoomsList";
import { parseInt } from 'lodash';

const Chat = () => {
  const [text, changeText] = useState<string>("");

  const [socket, setSocket] = useState<Socket>();
  const [username, changeUsername] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const [joinButton, setJoinButton] = useState<string>("Join");
  const [joinStatus, setJoinStatus] = useState<string>("Not joined");

  const [activeRoom, setActiveRoom] = useState<string>("");

  const [date, setDate] = useState<Date>(null);

  const [gameButton, setGameButton] = useState<string>("invite");

  const chatEndRef = useRef(null);

  const auth = useAuth();

  const dmContext = useDm();

  const navigate = useNavigate();

  /* ***************************************************************************** */
  /*    							Functions utiles		    					 */
  /* ***************************************************************************** */

  const findActiveRoom = (): IRoom => {
    let activeRoom: IRoom = {
      active: false,
      member: false,
      ban: false,
      mute: false,
      owner: "",
      name: "",
      type: -1,
      messages: [],
    };
    rooms.forEach((element: IRoom) => {
      if (element.active === true) activeRoom = element;
    });
    return activeRoom;
  };

  const findRoom = (roomName: string): IRoom => {
    return rooms.find((element: IRoom) => {
      if (element.name === roomName) return element;
    });
  };

  const setJoinButtonAndStatus = () => {
    const activeRoom = findActiveRoom();
    if (activeRoom.member) {
      setJoinButton("Leave");
      setJoinStatus("Joined");
    } else {
      setJoinButton("Join");
      setJoinStatus("Not joined");
    }
  };

  const setActiveForRoom = (roomName: string) => {
    //TODO: update button
    rooms.forEach((element: IRoom) => {
      element.active = element.name === roomName ? true : false;
    });
    setActiveRoom(roomName);
    setJoinButtonAndStatus();
    const roomActive = findActiveRoom();
    if (roomActive.InviteUserName === username) setGameButton("cancel");
    else if (roomActive.InviteUserName !== "") setGameButton("join");
    else setGameButton("invite");
  };

  // const isAlpha = (input: string) => {
  //   for (let index = 0; index < input.length; index++) {
  //     const element = input.charCodeAt(index);
  //     if (element < 48 || element > 122 || (element >= 58 && element <= 64))
  //       return false;
  //   }
  //   return true;
  // };

  // const parseRoomName = (roomName: string) => {
  //   let status: boolean = true;
  //   if (roomName === "") {
  //     alert("you need to write a name please");
  //     status = false;
  //   } else if (roomName.length > 20) {
  //     alert("the name cannot exceed 20 characters");
  //     status = false;
  //   } else if (isAlpha(roomName) === false) {
  //     alert("the name contains none alphanumeric character.s");
  //     status = false;
  //   }
  //   return status;
  // };

  /* ***************************************************************************** */
  /*    					Functions pour la gestion des chats 					 */
  /* ***************************************************************************** */

  const handleChange = (event: any) => {
    changeText(event.target.value);
  };

  const wrongPasswordMessage = () => {
    alert("WRONG PASSWORD ! YOU CANNOT JOIN THIS CHANNEL");
  };

  const pswdDeletedMessage = () => {
    alert("The password has been successfully deleted");
  };

  const pswdUpdateMessage = () => {
    alert("The password has been successfully updated");
  };

  const channelCreatedMsg = () => {
    alert('The room has been successfully created');
  }

  const changeChannelOwner = (update: {
    newOwner: string;
    channel: string;
  }) => {
    let room = findRoom(update.channel);
    room.owner = update.newOwner;
  };

  const isAdminInActive = (name: string): boolean => {
    const activeRoom = findActiveRoom();
    let value: boolean = false;

    activeRoom.adminsList.forEach((admin: string) => {
      if (admin == name) value = true;
    });
    return value;
  };

  const userSetAdmin = (name: string) => {
    const activeRoom = findActiveRoom();
    if (!isAdminInActive(name)) {
      socket?.emit("setUserAsAdmin", { name: name, channel: activeRoom.name });
    }
  };

  const userMuteUser = (name: string, timer: number) => {
    const activeRoom = findActiveRoom();
    socket?.emit("muteMember", {
      name: name,
      channel: activeRoom.name,
      time: timer,
    });
  };

  const userBanUser = (name: string, timer: number) => {
    const activeRoom = findActiveRoom();
    socket?.emit("banMember", {
      name: name,
      channel: activeRoom.name,
      time: timer,
    });
  };

  const updateBanStatus = (member: { status: boolean; channel: string }) => {
    // console.log("BanStatus");
    let room = findRoom(member.channel);
    room.ban = member.status;
    if (room.ban) {
      alert("Congratulations, you are banned from " + member.channel);
      if (room.name === activeRoom)
      {
        setActiveForRoom("");
        setGameButton("invite");
      }
    } else {
      alert(
        "Congratulations, you are not banned from " +
          member.channel +
          " anymore"
      );
    }
  };

  const updateMuteStatus = (member: {
    status: boolean;
    channel: string;
    time: number;
  }) => {
    // console.log("MuteStatus");
    let room = findRoom(member.channel);
    room.mute = member.status;
    if (room.mute)
      alert(
        "Congratulations, you are muted in " +
          member.channel +
          " for " +
          member.time +
          " minutes"
      );
    else
      alert(
        "Congratulations, you are not muted in " + member.channel + " anymore"
      );
  };

  const getListsForAChannel = (lists: {
    channel: string;
    usersList: any[];
    adminsList: any[];
    banList: any[];
    muteList: any[];
  }) => {
    let room = findRoom(lists.channel);
    let newUsers: string[] = [];
    let newAdmins: string[] = [];
    let newBans: string[] = [];
    let newMutes: string[] = [];
    if (lists.usersList.length > 0) {
      lists.usersList.forEach((element: any) => {
        newUsers.push(element.user.name);
      });
    }
    room.usersList = newUsers;
    if (lists.adminsList.length > 0) {
      lists.adminsList.forEach((element: any) => {
        newAdmins.push(element.user.name);
      });
    }
    room.adminsList = newAdmins;
    if (lists.banList.length > 0) {
      lists.banList.forEach((element: any) => {
        newBans.push(element.user.name);
      });
    }
    room.banList = newBans;
    if (lists.muteList.length > 0) {
      lists.muteList.forEach((element: any) => {
        newMutes.push(element.user.name);
      });
    }
    room.muteList = newMutes;
    // POUR RERENDER LA PAGE CAR ROOMS EST UN USESTATE, ET QUAND LE USESTATE EST MODIFIE CA RERENDER
    const roomsCopy = [...rooms];
    setRooms(roomsCopy);
  };

  const sendChatMessage = (event: any) => {
    event.preventDefault();
    const activeRoom = findActiveRoom();
    if (activeRoom.member && activeRoom.mute === false && text.trim().length !== 0) {
      socket?.emit("chatToServer", {
        sender: username,
        room: activeRoom.name,
        msg: text,
      });
    } else {
      if (activeRoom.mute) alert("You cannot talk in this room bitch !");
      else if (activeRoom.member === false)
        alert("You must join a room to send a message.");
      changeText("");
    }
  };

  const receiveChatMessage = (obj: {
    sender: string;
    senderId: number,
    room: string;
    content: string;
    date: Date;
  }) => {
    const theroom: IMessageToBack = {
      sender: obj.sender,
      senderId: obj.senderId,
      message: obj.content,
      date: obj.date,
    };

    rooms.forEach((element: IRoom) => {
      if (element.name === obj.room) {
        element.messages.push(theroom);
      }
    });
    const roomsCopy = [...rooms];
    setRooms(roomsCopy);
    changeText("");
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const addARoom = (roomName : string, typeRoom : string, password : string) => {
    
      if (findRoom(roomName)) {
        alert("This name is already taken. Try another one.");
        return;
      }
      if (roomName === "" || roomName === null || roomName.trim().length === 0)
      {
        alert("The room name cannot be empty.");
        return;
      }
      if (typeRoom === "-1")
      {
        alert("You must choose a room type, please !");
        return;
      }
    const dbRoom: IChatRoom = {
      chatRoomName: roomName,
      owner: username,
      type: parseInt(typeRoom, 10),
      password: password,
    };
      socket?.emit("createChatRoom", dbRoom);
  };

  const deleteARoom = (roomName: string) => {
    if (window.confirm("Are you sure you want to delete " + roomName + " ?"))
      socket?.emit("deleteChatRoom", roomName);
  };

  const leftRoom = (room: string) => {
    rooms.forEach((element: any) => {
      if (element.name === room) {
        element.member = false;
        if (element.type === type.private) setActiveRoom("");
      }
    });
    setJoinButtonAndStatus();
    if (findRoom(room) !== undefined) socket?.emit("getLists", room);
  };

  const joinedRoom = (room: string) => {
    // console.log("joined " + room);
    rooms.forEach((element: any) => {
      if (element.name === room) element.member = true;
    });
    setJoinButtonAndStatus();
    socket?.emit("getLists", room);
  };

  const handlingPasswordPart1 = (room: string, user: string) => {
    socket?.emit("checkPswdStatus", { room: room, user: user });
  };

  const handlingPasswordPart2 = (infos: {room: string; user: string; pswdStatus: boolean;}) => {
    let pswd: string = undefined;
    if (infos.pswdStatus) {
      pswd = prompt(
        "you need a password to join this channel, please type it: "
      );
      if (pswd === null) return;
    }
    socket?.emit("joinRoom", {
      room: infos.room,
      user: infos.user,
      password: pswd,
    });
  };

  const toggleRoomMembership = (event: any) => {
    event.preventDefault();
    const activeRoom = findActiveRoom();
    if (activeRoom.member) {
      socket?.emit("leaveRoom", { room: activeRoom.name, user: username });
    } else {
      if (activeRoom.type === type.protected) {
        handlingPasswordPart1(activeRoom.name, username);
        return;
      }
      socket?.emit("joinRoom", {
        room: activeRoom.name,
        user: username,
        password: undefined,
      });
    }
  };

  const receiveAllChannels = (channels: any[]) => {
    let roomsCopy = [...rooms];

    channels.forEach((element) => {
      let isMemberOrNot: boolean = false;
      let isBan: boolean = false;
      let isMute: boolean = false;
      let member: any = element.members.find(
        (member: any) => member.user.name === username
      );
      if (member !== undefined) {
        isMemberOrNot = true;
        isBan = member.isBan;
        isMute = member.isMute;
      }

      const newRoom: IRoom = {
        active: false,
        member: isMemberOrNot,
        ban: isBan,
        mute: isMute,
        owner: element.owner.name,
        name: element.chatRoomName,
        type: element.type,
        InviteUserName: element.InviteUserName,
		    InviteGameId: element.InviteGameId,
        messages: [],
      };
      [...element.messages].reverse().forEach((oneMessage: any) => {
        newRoom.messages.push({
          sender: oneMessage.sender,
          message: oneMessage.content,
          date: oneMessage.createdAt,
          senderId: oneMessage.senderId,
        });
      });
      roomsCopy.push(newRoom);
      socket.emit("getListsForOneClient", element.chatRoomName);
    });
    setRooms(roomsCopy);
  };

  const receiveNewChannel = (channel: any) => {
    let isMemberOrNot: boolean = false;
    let isBan: boolean = false;
    let isMute: boolean = false;
    let member: any = channel.members.find(
      (member: any) => member.user.name === username
    );
    if (member !== undefined) {
      isMemberOrNot = true;
      isBan = member.isBan;
      isMute = member.isMute;
    }

    const newRoom: IRoom = {
      active: false,
      member: isMemberOrNot,
      ban: isBan,
      mute: isMute,
      owner: channel.owner.name,
      name: channel.chatRoomName,
      type: channel.type,
      InviteUserName: channel.InviteUserName,
      InviteGameId: channel.InviteGameId,
      messages: [],
    };
    if (channel.messages !== undefined) {
      [...channel.messages].reverse().forEach((oneMessage: any) => {
        newRoom.messages.push({
          sender: oneMessage.sender,
          message: oneMessage.content,
          date: oneMessage.createdAt,
          senderId: oneMessage.senderId,
        });
      });
    }
    socket?.emit("getListsForOneClient", channel.chatRoomName);

    const roomsCopy = [...rooms];
    roomsCopy.push(newRoom);
    setRooms(roomsCopy);
  };

  const deleteChannel = (channel: any) => {
    let roomsCopy = [...rooms];
    for (let i = 0; i < roomsCopy.length; i++) {
      if (roomsCopy[i].name === channel) {
        roomsCopy.splice(i, 1);
        setActiveForRoom("");
        setGameButton("invite");
      }
    }
    setRooms(roomsCopy);
  };

  const deleteChannelPassword = (event: any) => {
    const activeRoom = findActiveRoom();
    if (
      window.confirm(
        "Are you sure you want to delete the password of this channel ?"
      )
    )
      socket?.emit("deleteChannelPassword", activeRoom.name);
  };

  const updateChannelPassword = (newPwd: string) => {
    const activeRoom = findActiveRoom();
    socket?.emit("updateChannelPassword", {
      room: activeRoom.name,
      newPassword: newPwd,
    });
  };

  const inviteToPrivate = () => {
    socket?.emit("getFriendsList", username);
  };

  const askWhichFriend = (friends: any) => {
    let friendName: string = null;
    let nameFound: string = undefined;
    const roomActive = findActiveRoom();
    if (friends.length === 0)
      alert("you need at least one friend to invite in your room");
    else {
      if ((friendName = prompt("type the name of the friend ")) == null) return;
      friends.find((friend: any) => {
        if (friend.user.name === friendName) nameFound = friend.user.name;
      });
      if (nameFound === undefined) alert("friend not found, sorry");
      else if (
        roomActive.usersList.find((name: string) => name === nameFound) !=
        undefined
      ) {
        alert(nameFound + " is already in the room, oh almighty corrector !");
      } else {
        socket?.emit("emitForAnPrInvite", {
          sender: username,
          receiver: nameFound,
          channel: roomActive.name,
        });
      }
    }
  };

  const CreateGameInvite = (event: any) => {
    event.preventDefault();
    const roomActive = findActiveRoom();
    if (
      activeRoom !== "" &&
      roomActive.member &&
      roomActive.usersList.length > 1 &&
      auth.user.hasSentAnInvite === false &&
      auth.user.inGame === false &&
      auth.user.inQueue === false
    ) {
      socket?.emit("createGameInvite", {
        user: auth.user,
        userList: roomActive.usersList,
        name: roomActive.name,
      });
    } else alert("You cannot send a game invite !");
  };

  const CancelGameInvite = (event: any) => {
    event.preventDefault();
	const inviteMessage: string =
      "--- " + username + " has canceled his invite to a Pong game ---";
    socket?.emit("chatToServer", {
      sender: username,
      room: findActiveRoom().name,
      msg: inviteMessage,
    });
    socket?.emit("askToCancelGameInvite", auth.user);
  };

  const JoinGameInvite = (event: any) => {
    event.preventDefault();
    const roomActive = findActiveRoom();
	if (joinStatus === "Not joined") {
		alert("You cannot join a game invite if you'r not in the channel !")
		return;
	}
    socket?.emit("invitationAccepted", {
      user: auth.user,
      inviter: roomActive.InviteUserName,
      gameId: roomActive.InviteGameId,
      name: roomActive.name,
    });
  };

  const sendGameInviteMessage = () => {
    const inviteMessage: string =
      "--- " + username + " has sent an invite to a Pong game ---";
    socket?.emit("chatToServer", {
      sender: username,
      room: findActiveRoom().name,
      msg: inviteMessage,
    });
    navigate("/pong/");
  };

  const navigateToTheGame = () => {
    const inviteMessage: string =
      "--- " + username + " has joined the Pong game ---";
    socket?.emit("chatToServer", {
      sender: username,
      room: findActiveRoom().name,
      msg: inviteMessage,
    });
    navigate("/pong/");
  };

  socket?.on("updateUser", (user: IUser) => {
    if (user.name === username) {
      user.avatarUrl = auth.user.avatarUrl;
      auth.user = user;
    }
  });

  socket?.on("changeGameButton", (infos: { status: string; channel: any }) => {
    setGameButton(infos.status);
    let roomActive = findActiveRoom();
    roomActive.InviteGameId = infos.channel.InviteGameId;
    roomActive.InviteUserName = infos.channel.InviteUserName;
	socket?.emit("updateUserChat", auth.user);
  });

  /* ***************************************************************************** */
  /*    						Les différents UseEffets    						 */
  /* ***************************************************************************** */

  // USEEFFECT POUR CREER UN SOCKET
  useEffect(() => {
    // console.log("connect");
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    changeUsername(auth.user.name);
    const roomActive = findActiveRoom();
    if (!roomActive) setGameButton("invite");
    else socket?.emit("inviteAcceptCancel", username, roomActive.name);
  }, []);

  useEffect(() => {
    socket?.emit("getAllChannels");
  }, [username]);

  // STOCKER UN SOCKET DANS LE BACK AVEC LE NOM DU USER
  useEffect(() => {
    socket?.emit("addSocket", username);
  });

  useEffect(() => {
    socket?.on("newOwner", changeChannelOwner);
    return () => {
      socket?.off("newOwner", changeChannelOwner);
    };
  }, [changeChannelOwner]);

  useEffect(() => {
    socket?.on("sendAllChannels", receiveAllChannels);
    return () => {
      socket?.off("sendAllChannels", receiveAllChannels);
    };
  }, [receiveAllChannels]);

  useEffect(() => {
    socket?.on("sendNewChannel", receiveNewChannel);
    return () => {
      socket?.off("sendNewChannel", receiveNewChannel);
    };
  }, [receiveNewChannel]);

  useEffect(() => {
    socket?.on("sendDeleteMessage", deleteChannel);
    return () => {
      socket?.off("sendDeleteMessage", deleteChannel);
    };
  }, [receiveAllChannels]);

  // USEFFECT POUR RECEVOIR UN MESSAGE POUR UNE ROOM
  useEffect(() => {
    socket?.on("chatToClient", receiveChatMessage);
    return () => {
      //   console.log("chatToClient name === " + username);
      socket?.off("chatToClient", receiveChatMessage);
    };
  }, [receiveChatMessage]);

  // USEFFECT POUR QUITTER UNE ROOM
  useEffect(() => {
    // console.log('leftRoom');
    socket?.on("leftRoom", leftRoom);
    return () => {
      socket?.off("leftRoom", leftRoom);
    };
  }, [leftRoom]);

  // USEFFECT POUR REJOINDRE UNE ROOM
  useEffect(() => {
    // console.log('joinedRoom');
    socket?.on("joinedRoom", joinedRoom);
    return () => {
      socket?.off("joinedRoom", joinedRoom);
    };
  }, [joinedRoom]);

  // USEEFFECT POUR UN MAUVAIS MOT DE PASSE
  useEffect(() => {
    socket?.on("wrongPasswordForTheJoin", wrongPasswordMessage);
    return () => {
      socket?.off("wrongPasswordForTheJoin", wrongPasswordMessage);
    };
  }, [wrongPasswordMessage]);

  //USEFFECT POUR UN PASSWORD DELETED
  useEffect(() => {
    socket?.on("Password deleted", pswdDeletedMessage);
    return () => {
      socket?.off("Password deleted", pswdDeletedMessage);
    };
  }, [pswdDeletedMessage]);

  useEffect(() => {
    socket?.on("Password updated", pswdUpdateMessage);
    return () => {
      socket?.off("Password updated", pswdUpdateMessage);
    };
  }, [pswdUpdateMessage]);

  // GET LISTS
  useEffect(() => {
    socket?.on("AllLists", getListsForAChannel);
    return () => {
      socket?.off("AllLists", getListsForAChannel);
    };
  }, [getListsForAChannel]);

  // UPDATE BAN STATUS
  useEffect(() => {
    socket?.on("BanStatus", updateBanStatus);
    return () => {
      socket?.off("BanStatus", updateBanStatus);
    };
  }, [updateBanStatus]);

  useEffect(() => {
    socket?.on("MuteStatus", updateMuteStatus);
    return () => {
      socket?.off("MuteStatus", updateMuteStatus);
    };
  }, [updateMuteStatus]);

  useEffect(() => {
    socket?.on("recvFriendsList", askWhichFriend);
    return () => {
      socket?.off("recvFriendsList", askWhichFriend);
    };
  }, [askWhichFriend]);

  useEffect(() => {
    socket?.on("handleProtected", handlingPasswordPart2);
    return () => {
      socket?.off("handleProtected", handlingPasswordPart2);
    };
  }, [handlingPasswordPart2]);

  useEffect(() => {
    socket?.on("recvGameInvite", sendGameInviteMessage);
    return () => {
      socket?.off("recvGameInvite", sendGameInviteMessage);
    };
  }, [sendGameInviteMessage]);

  useEffect(() => {
    socket?.on("navigateToTheGame", navigateToTheGame);
    return () => {
      socket?.off("navigateToTheGame", navigateToTheGame);
    };
  }, [navigateToTheGame]);

  useEffect(() => {
    socket?.on("Channel created", channelCreatedMsg);
    return () => {
      socket?.off("Channel created", channelCreatedMsg);
    };
  }, [channelCreatedMsg]);

  const sortedMessages = findActiveRoom().messages.sort((a, b) => {
    // Compare the dates of the messages to determine their order
    return new Date(a.date) - new Date(b.date);
  });

  const switchDm = (event: any) => {
    event.preventDefault();
    dmContext.switchDm();
  };

  return (
    <div className="chat-container">
      <RoomsList
        rooms={rooms}
        findRoom={findRoom}
        setActiveForRoom={setActiveForRoom}
        addARoom={addARoom}
		switchDm={switchDm}
      />
      <div className="middle">
        <div className="top-chat">
          <p>Active room : {activeRoom} </p>
          {activeRoom !== "" ? "Status: " + joinStatus + " " : null}
          {activeRoom !== "" ? (
            <button onClick={toggleRoomMembership}>{joinButton}</button>
          ) : null}
          {findActiveRoom().type == type.private &&
          findActiveRoom().owner == username ? (
            <button onClick={inviteToPrivate}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user-plus"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                <path d="M16 11h6m-3 -3v6"></path>
              </svg>
            </button>
          ) : null}
          {findActiveRoom().owner == username ? (
            <RoomSettings
              activeRoom={activeRoom}
              muteList={findActiveRoom().muteList}
              banList={findActiveRoom().banList}
              updateChannelPassword={updateChannelPassword}
              type={findActiveRoom().type}
              deleteChannelPassword={deleteChannelPassword}
              deleteARoom={deleteARoom}
            />
          ) : null}
        </div>
        <div className="chat-box">
          <ul>
            {findActiveRoom().member ? (
              sortedMessages.map((msg: any, id: number) => (
                !dmContext.isBlock(msg.senderId) &&
                <div key={id}
                  className={
                    msg.sender == username
                      ? "owner_messages"
                      : "others-messages"
                  }
                >
                  <li key={id}>
                    <div className="sender-username">{msg.sender}</div>
                    <p>{msg.message}</p>
                    <div className="message-date">
                      {msg.date.slice(0, 10) + " " + msg.date.slice(11, 16)}
                    </div>
                  </li>
                </div>
                )) 
            ) : (
              <div></div>
            )}
            <li key="end">
              <div className="endchat" ref={chatEndRef} />
            </li>
          </ul>
        </div>
        <div className="chat-bottom">
          <div className="chat-send-msg">
            <form onSubmit={sendChatMessage}>
              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Type something ..."
              />
              <button type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-brand-telegram"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
                </svg>
              </button>
            </form>
          </div>
          {gameButton === "invite" && (
            <GameInviteButton CreateGameInvite={CreateGameInvite} />
          )}
          {gameButton === "cancel" && (
            <CancelInviteButton CancelGameInvite={CancelGameInvite} />
          )}
          {gameButton === "join" && (
            <JoinInviteButton joinGameInvite={JoinGameInvite} />
          )}
        </div>
      </div>
      <RoomUserList
        findActiveRoom={findActiveRoom}
        isAdminInActive={isAdminInActive}
        userSetAdmin={userSetAdmin}
        userBanUser={userBanUser}
        userMuteUser={userMuteUser}
        username={username}
        activeRoom={activeRoom}
        muteList={findActiveRoom().muteList}
        banList={findActiveRoom().banList}
      />
    </div>
  );
};

export default Chat;
