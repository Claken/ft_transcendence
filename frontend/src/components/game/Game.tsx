import React, { useRef, useEffect, useState } from "react";
import { socket } from "../Socket";
import "../../styles/canvas.css"
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

import Colors from "./colors";
import State from "./state";
import allPos from "./allPos";
import gameBoards from "./gameBoards";

import button from "./button";
import pausePage from "./pagePause";
import losePage from "./pageLose";
import winPage from "./pageWin";
import leavePage from "./pageLeave";
import initPage from "./pageInit";
import endPage from "./pageEnd";
import { IUser } from "../../interfaces/user.interface";

const Game = (
	props: JSX.IntrinsicAttributes &
		React.ClassAttributes<HTMLCanvasElement> &
		React.CanvasHTMLAttributes<HTMLCanvasElement> ) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let CanvasWidth = 1600;
	let CanvasHeight = 760;
	let EmptyGround = 50;
	const auth = useAuth();
	const { gameId } = useParams();
	const [init, setInit] = useState<boolean>(false);
	var key = "";
	var prev = "";
	var curr = "";
	const color = [];

	/* ***************************************************************************** */
	/*                 Initialisation de la Game et des 2 joueurs                    */
	/* ***************************************************************************** */
	useEffect(() => {
		socket.on("updateData", (newData) => {
			allPos.map = newData.map;
			if (newData.compteur === 10)
				allPos.compteur = newData.compteur;
			else
				allPos.compteur = null;
			allPos.state = newData.state;
			allPos.scoreLP = newData.scoreLP;
			allPos.scoreRP = newData.scoreRP;
			allPos.nameLP = newData.nameLP;
			allPos.nameRP = newData.nameRP;
			allPos.gameId = gameId;
			allPos.WinLoseL = newData.WLuserL;
			allPos.WinLoseR = newData.WLuserR;
			if (auth.user.name !== allPos.nameLP && auth.user.name !== allPos.nameRP)
				allPos.viewer = true;
			setInit(true);
		});

		if (auth.user) {
			//Si game sur invit, alors faire les prepa ?
			socket.emit("updateData", gameId);
		}
	}, [])

	/* ***************************************************************************** */
	/*            Ajout d'event pour écouter les touches/cliques entrant             */
	/* ***************************************************************************** */
	const pauseGame = (e) => {
		if (allPos.viewer)
			return ;
		if (e.key === "p"|| e.key === "P" || e.key === " ") {
			e.preventDefault();
			if (allPos.state === State.PLAY)
				socket.emit("pauseNplay", State.PAUSE, auth.user.name, gameId);
			else if (allPos.state === State.PAUSE)
				socket.emit("pauseNplay", State.PLAY, "", gameId);
		}
	};

	const movePlayer = (e) => {
		if (allPos.viewer)
			return ;
		if (
			e.key === "ArrowUp" ||
			e.key === "ArrowDown" ||
			e.key === "w" ||
			e.key === "s" ||
			e.key === "z" ||
			e.key === "W" ||
			e.key === "S" ||
			e.key === "Z"
		) {
			e.preventDefault();
			if (curr !== e.key) prev = curr;
			allPos.key = e.key;
			curr = allPos.key;
		}
	};

	const stopPlayer = (e) => {
		if (allPos.viewer)
			return ;
		if (
			e.key === "ArrowUp" ||
			e.key === "ArrowDown" ||
			e.key === "w" ||
			e.key === "s" ||
			e.key === "z" ||
			e.key === "W" ||
			e.key === "S" ||
			e.key === "Z"
		) {
			e.preventDefault();
			if (e.key !== prev) curr = prev;
			allPos.key = curr;
			prev = "";
		}
	};

	const clickInterpreter = (e) => {
		if (allPos.viewer)
			return ;
		let x = e.offsetX;
		let y = e.offsetY;
		e.preventDefault();

		if (allPos.state === State.INIT) {
			if (x > allPos.width/2 - 600 && x < allPos.width/2 - 300 && y > 300 && y < 500
				&& color[0] !== Colors.green) {
				socket.emit("image", auth.user.name, allPos , 0);
			} //CLASSIC
			if (x > allPos.width/2 -150 && x < allPos.width/2 + 150 && y > 400 && y < 600
				&& color[1] !== Colors.green){
				socket.emit("image", auth.user.name, allPos , 1);
			} //THEWITCHER
			if (x > allPos.width/2 + 300 && x < allPos.width/2 + 600 && y > 300 && y < 500
				&& color[2] !== Colors.green) { //POKEMON
				socket.emit("image", auth.user.name, allPos , 2);
			}
		}
		else if (allPos.state === State.PAUSE || allPos.state === State.PLAY) {
			if (x > allPos.width / 2 - 150 - allPos.radius * 2 &&//button Pause/Play
				x < allPos.width / 2 - 150 + allPos.radius * 2 &&
				y > 25 - allPos.radius * 2 &&
				y < 25 + allPos.radius * 2) {
				if (allPos.state === State.PLAY)
					socket.emit("pauseNplay", State.PAUSE, auth.user.name, gameId);
				else if(allPos.state === State.PAUSE)
					socket.emit("pauseNplay", State.PLAY, "", gameId);
			}
			else if (//button stop
				x > allPos.width / 2 + 150 - allPos.radius * 2 &&
				x < allPos.width / 2 + 150 + allPos.radius * 2 &&
				y > 25 - allPos.radius * 2 &&
				y < 25 + allPos.radius * 2) {
					socket.emit("abort", allPos, auth.user.name);
			}
		}
	};

/* ***************************************************************************** */
/*                             USEEFFECT PRINCIPALE                              */
/* ***************************************************************************** */
	useEffect(() => {
		if (init === false || !auth.user)
			return ;
		const canvas = canvasRef.current;
		if (canvas == null) return;
		const context = canvas.getContext("2d");
		if (context == null) return;
		var ready = false;
		allPos.width = canvas.width; //largeur du canvas
		allPos.height = canvas.height; //hauteur du canvas
		allPos.paddleH = allPos.height / 8; //hauteur du paddle
		allPos.paddleW = allPos.width / 150; //largeur du paddle
		allPos.radius = 10; //taille de la balle
		allPos.ballW = 15; //largeur de la balle
		allPos.ballH = allPos.ballW; //hauteur de la balle
		allPos.EmptyGround = EmptyGround;
		allPos.mapLP = -1;
		allPos.mapRP = -1;
		allPos.pLY = allPos.height / 2 - EmptyGround / 2; //placement en hauteur du paddle gauche
		allPos.pRY = allPos.height / 2 - EmptyGround / 2; //placement en hauteur du paddle droit
		allPos.ballX = (allPos.width / 2) - (allPos.ballW / 2); //placement en X de la balle
		allPos.ballY = allPos.height / 2 + EmptyGround / 2; //placement en Y de la balle
		allPos.vx = -1; //vitesse en X de la balle
		allPos.vy = -1; //vitesse en Y de la balle
		allPos.speed = 4;
		if (allPos.compteur === null)
			socket.emit("setCompteur", gameId);
		allPos.key = key;
		let animationFrameId: number;
		allPos.img = new Image();
		allPos.img.src = gameBoards[allPos.map];
		var mignature = [new Image(), new Image(), new Image()];
		mignature[0].src = gameBoards[0];
		mignature[1].src = gameBoards[1];
		mignature[2].src = gameBoards[2];

		document.addEventListener("keydown", pauseGame);
		document.addEventListener("keydown", movePlayer);
		document.addEventListener("keyup", stopPlayer);
		document.addEventListener("click", clickInterpreter);

		/* ***************************************************************************** */
		/*              Communication avec le back sur l'échange de données              */
		/* ***************************************************************************** */
		socket.on("update", (newData) => {
			allPos.ballX = newData.ballX;
			allPos.ballY = newData.ballY;
			allPos.vy = newData.vy;
			allPos.vx = newData.vx;
			allPos.scoreLP = newData.scoreLP;
			allPos.scoreRP = newData.scoreRP;
			allPos.speed = newData.speed;
			ready = true;
		});

		socket.on("updatedPlayer", (newData) => {
			allPos.pLY = newData.pLY;
			allPos.pRY = newData.pRY;
		});

		socket.on("PauseAndPlay", (infos) => {
			allPos.state = infos[0];
			prev = infos[1];
		});

		socket.on("updateImg", (infos) => {
			allPos.img.src = gameBoards[infos[2]];
			allPos.mapLP = infos[1].mapLP;
			allPos.mapRP = infos[1].mapRP;
			for (let index = 0; index < gameBoards.length; index++) {
				if (index === infos[2]) {
					auth.user.name === infos[0] ? color[index] = Colors.green : color[index] = Colors.red;
				}
				else {
					if (auth.user.name === infos[0] && color[index] === Colors.green)
						color[index] = Colors.white;
					else if (auth.user.name !== infos[0] && color[index] === Colors.red)
						color[index] = Colors.white;
				}
			}
		})

		socket.on("compteurUpdated", (currentSec) => {
			allPos.compteur = currentSec;
		})

		socket.on("launchGame", (map) => {
			allPos.img.src = gameBoards[map];
			ready = true;
			allPos.state = State.PLAY;
		});

		socket.on("endGame", (winner) => {
			if (allPos.viewer){
				allPos.state = State.END
				socket.emit("leaveSocket", gameId);
				return ;
			}
			auth.user.name === winner ? allPos.state = State.WIN : allPos.state = State.LOSE ;
			socket.emit("updateInGame", auth.user, gameId);
		})

		socket.on("opponentLeave", (abandoner) => {
			allPos.state = State.LEAVE;
			socket.emit("updateInGame", auth.user, gameId);
			socket.emit("endGameF", allPos, auth.user.name, abandoner, "");
		})

		socket.on("updateUser", (user: IUser) => {
			if (user.name === auth.user.name) {
				user.avatarUrl = auth.user.avatarUrl
				auth.user = user;
			}
		})

		/* ***************************************************************************** */
		/*                      Fonction principale de l'affichage                       */
		/* ***************************************************************************** */
		function render() {
			context.clearRect(0, 0, allPos.width, allPos.height);
			context.fillStyle = "black";
			context.fillRect(0, 50, allPos.width, allPos.height);
			context.drawImage(allPos.img, 0, 50, allPos.width, allPos.height);

			if (allPos.state === State.INIT) {
				initPage(context, color, mignature);
			} else if (allPos.state === State.PAUSE) {
				button(context);
				pausePage(context);
			}
			else if (allPos.state === State.LOSE)
				losePage(context);
			else if (allPos.state === State.WIN)
				winPage(context);
			else if (allPos.state === State.LEAVE)
				leavePage(context);
			else if (allPos.state === State.END)
				endPage(context);
			else if (allPos.state === State.PLAY) {
				button(context);
				if (!allPos.viewer &&
					(allPos.key === "ArrowUp" ||
					allPos.key === "ArrowDown" ||
					allPos.key === "w" ||
					allPos.key === "W" ||
					allPos.key === "s" ||
					allPos.key === "S" ||
					allPos.key === "z" ||
					allPos.key === "Z"))
					socket.emit("movePlayer", allPos, auth.user.name);
				if (!allPos.viewer && ready)
					socket.emit("update", allPos, auth.user);
			}
			context.font = "40px Roboto";
			context.fillStyle = "black";
			context.textAlign = "start";
			context.fillText(allPos.nameLP, 0, 40);
			context.textAlign = "end";
			context.fillText(allPos.nameRP, allPos.width, 40);
			context.textAlign = "center";
			context.font = "60px Roboto";
			context.fillText(allPos.scoreLP + " - " + allPos.scoreRP, allPos.width / 2, 45);
			context.beginPath();
			context.fillStyle = "white";
			if (allPos.state !== State.INIT)
				context.fillRect(allPos.ballX, allPos.ballY, allPos.ballW, allPos.ballH);
			context.fill();
			context.fillRect(1, allPos.pLY, allPos.paddleW, allPos.paddleH);
			context.fillRect(allPos.width - allPos.paddleW, allPos.pRY, allPos.paddleW - 1, allPos.paddleH);
			context.strokeStyle = "white";
			context.moveTo(allPos.width / 2, 50);
			context.lineTo(allPos.width / 2, allPos.height);
			if (allPos.state !== State.INIT && allPos.img.src !== gameBoards[2])
				context.stroke();
			animationFrameId = window.requestAnimationFrame(render);
		}
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", pauseGame);
			document.removeEventListener("keydown", movePlayer);
			document.removeEventListener("keyup", stopPlayer);
			document.removeEventListener("click", clickInterpreter);
			socket.off("update");
			socket.off("updatedPlayer");
			socket.off("PauseAndPlay");
			socket.off("updateImg");
			socket.off("compteurUpdated");
			socket.off("launchGame");
			socket.off("endGame");
			socket.off("opponentLeave");
			socket.off("updateUser");
		};
	},[init]);

	/* ***************************************************************************** */
	/*                          balise HTML de la page web                           */
	/* ***************************************************************************** */
	return (
		<div>
			<canvas
				ref={canvasRef}
				width={CanvasWidth}
				height={CanvasHeight}
				{...props}/>
		</div>
	);
};

export default Game;
