import React, { useRef, useEffect, useState } from "react";
import { socket } from "../Socket";
import "../../styles/canvas.css"
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../axios.config";
import { IGame } from "../../interfaces/game.interface"
import { useParams } from "react-router-dom";

import Colors from "./colors";
import State from "./state";
import allPos from "./allPos";
import gameBoards from "./gameBoards";

import button from "./button";
import pausePage from "./pagePause";
import losePage from "./pageLose";
import winPage from "./pageWin";
import initPage from "./pageInit";

const Game = (
	props: JSX.IntrinsicAttributes &
		React.ClassAttributes<HTMLCanvasElement> &
		React.CanvasHTMLAttributes<HTMLCanvasElement> ) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let CanvasWidth = 1600;
	let CanvasHeight = 760;
	let EmptyGround = 50;
	// const [playerL, setPlayerL] = useState(0); // avoir le profil du user
	// const [playerR, setPlayerR] = useState(0); // avoir le profil du user
	const [loginLP, setLoginLP] = useState("Player 1"); // avoir le login du joueur de gauche pour l'afficher
	const [loginRP, setLoginRP] = useState("Player 2"); // avoir le login du joueur de droite pour l'afficher
	const [scoreLP, setScoreLP] = useState(0); // Score du joueur gauche
	const [scoreRP, setScoreRP] = useState(0); // Score du joueur droit
	const [abort, setAbort] = useState(false);
	const [game, setGame] = useState<IGame>(null);
	// const [games, setGames] = useState<IGame[]>([]);//TODO: utilité ?
	const auth = useAuth();
	const { gameId } = useParams();
	const [lock, setLock] = useState<boolean>(false);
	var key = "";
	var prev = "";
	var curr = "";
	const color = [];

	/* ***************************************************************************** */
	/*                 Initialisation de la Game et des 2 joueurs                    */
	/* ***************************************************************************** */
	useEffect(() => {
		if (game) {
			console.log("useEffect [game]") //TODO: retirer
			setLoginLP(game.loginLP);
			setLoginRP(game.loginRP);
			setScoreLP(0);
			setScoreRP(0);
			allPos.loginLP = game.loginLP;
			allPos.loginRP = game.loginRP;
			allPos.idGame = game.id;
			if (auth.user.name === allPos.loginLP && !lock) {
				setLock(true)
				if (allPos.compteur === null || allPos.compteur === 10)
					socket.emit("setCompteur", allPos.compteur);
			}
		}
	}, [game])

	const getGameById = async () => {
		await axios
			.get("/game/" + gameId)
			.then((res) => {
				setGame(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getGameById();
	}, [])

	//TODO: Quand un user est offline (user.status)
	// useEffect(() => {
	// 	// socket.emit();
	// 	console.log("entrée dans le useEffect de la reconnexion (GAME.TSX"); //TODO: retirer
	// }, [auth.user.status])

	//TODO: Si il déco, setAbort ?
	//Un joueur abort la game car il se fait daronned
	useEffect(() => {
		if (abort === true) {
			// socket.emit();
			console.log("entrée dans le useEffect du ABORT"); //TODO: retirer
		}
	}, [abort])

	/* ***************************************************************************** */
	/*            Ajout d'event pour écouter les touches/cliques entrant             */
	/* ***************************************************************************** */
	const pauseGame = (e) => {
		if (e.key === "p"|| e.key === "P" || e.key === " ") {
			e.preventDefault();
			if (allPos.state === State.PLAY)
				socket.emit("pause&play", State.PAUSE, auth.user.name);
			else if (allPos.state === State.PAUSE && auth.user.name === prev)
				socket.emit("pause&play", State.PLAY, "");
		}
	};

	const movePlayer = (e) => {
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
					socket.emit("pause&play", State.PAUSE, auth.user.name);
				else if(allPos.state === State.PAUSE && auth.user.name === prev)
					socket.emit("pause&play", State.PLAY, "");
			}
			else if (//button stop
				x > allPos.width / 2 + 150 - allPos.radius * 2 &&
				x < allPos.width / 2 + 150 + allPos.radius * 2 &&
				y > 25 - allPos.radius * 2 &&
				y < 25 + allPos.radius * 2) {
					socket.emit("state", State.ABORT, allPos, auth.user.name);
			}
		}
	};

/* ***************************************************************************** */
/*                             USEEFFECT PRINCIPALE                              */
/* ***************************************************************************** */
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null) return;
		const context = canvas.getContext("2d");
		if (context == null) return;
		allPos.width = canvas.width; //largeur du canvas
		allPos.height = canvas.height; //hauteur du canvas
		allPos.pLY = allPos.height / 2 - EmptyGround / 2; //placement en hauteur du paddle gauche
		allPos.pRY = allPos.height / 2 - EmptyGround / 2; //placement en hauteur du paddle droit
		allPos.paddleH = allPos.height / 8; //hauteur du paddle
		allPos.paddleW = allPos.width / 150; //largeur du paddle
		allPos.radius = 10; //taille de la balle
		allPos.ballW = 15; //largeur de la balle
		allPos.ballH = allPos.ballW; //hauteur de la balle
		allPos.ballX = (allPos.width / 2) - (allPos.ballW / 2); //placement en X de la balle
		allPos.ballY = allPos.height / 2 + EmptyGround / 2; //placement en Y de la balle
		allPos.vx = -1; //vitesse en X de la balle
		allPos.vy = -1; //vitesse en Y de la balle
		allPos.scoreLP = scoreLP;
		allPos.scoreRP = scoreRP;
		allPos.EmptyGround = EmptyGround;
		allPos.state = 0; //etat du jeu
		allPos.score = 5;
		allPos.speed = 2;
		allPos.mapLP = -1;
		allPos.mapRP = -1;
		if (allPos.compteur === null)
			allPos.compteur = socket.emit("getCompteur", gameId);
		allPos.key = key;
		let animationFrameId: number;
		allPos.img = new Image();
		var mignature = [new Image(), new Image(), new Image()];
		allPos.img.src = gameBoards[0];
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
		socket.on("updatedData", (newData) => {
			allPos.ballX = newData.ballX;
			allPos.ballY = newData.ballY;
			allPos.vy = newData.vy;
			allPos.vx = newData.vx;
			allPos.scoreLP = newData.scoreLP;
			allPos.scoreRP = newData.scoreRP;
			allPos.score = newData.score;
			allPos.speed = newData.speed;
			allPos.state = newData.state;
		});

		socket.on("updatedPlayer", (newData) => {
			allPos.pLY = newData.pLY;
			allPos.pRY = newData.pRY;
		});

		socket.on("updatedState", (newState) => {
			allPos.state = newState;
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
			allPos.state = State.PLAY;
		});

		socket.on("endGame", (winner, loser, capitulator) => {
			socket.emit("updateInGame", auth.user)
			auth.user.name === winner ? allPos.state = State.WIN : allPos.state = State.LOSE ;//TODO: allPos ou pas ?
			socket.emit("endGame", allPos, winner, loser, capitulator, auth.user);
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
			else if (allPos.state === State.PLAY) {
				button(context);
				if (
					allPos.key === "ArrowUp" ||
					allPos.key === "ArrowDown" ||
					allPos.key === "w" ||
					allPos.key === "W" ||
					allPos.key === "s" ||
					allPos.key === "S" ||
					allPos.key === "z" ||
					allPos.key === "Z"
				)
					socket.emit("movePlayer", allPos, auth.user.name);
				socket.emit("update", allPos, auth.user);
			}
			context.font = "40px Roboto";
			context.fillStyle = "black";
			context.textAlign = "start";
			context.fillText(allPos.loginLP, 0, 40);
			context.textAlign = "end";
			context.fillText(allPos.loginRP, allPos.width, 40);
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
		//
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", pauseGame);
			document.removeEventListener("keydown", movePlayer);
			document.removeEventListener("keyup", stopPlayer);
			document.removeEventListener("click", clickInterpreter);
			socket.off("updatedData");
			socket.off("updatedPlayer");
			socket.off("updatedState");
			socket.off("updateImg");
			socket.off("compteurUpdated");
			socket.off("launchGame");
			socket.off("endGame");
			socket.off("PauseAndPlay");
		};
	// },[]);
	},[loginRP]);

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
