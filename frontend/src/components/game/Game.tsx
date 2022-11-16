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
	const [games, setGames] = useState<IGame[]>([]);//TODO: utilité ?
	const auth = useAuth();
	const { gameId } = useParams();
	const [lock, setLock] = useState<boolean>(false);
	var intervalID = null;
	var key = "";
	var prev = "";
	var curr = "";
	const color = [];

	const tick = () => {
		if (allPos.compteur === -1)
			clearInterval(intervalID);
		if (allPos.compteur === 0) {
			clearInterval(intervalID);
			socket.emit("randomMap")
		}
		else if (allPos.compteur > 0) {
			allPos.compteur--;
			socket.emit("compteur", allPos.compteur);
		}
	}

	//TODO: Si la partie existe déjà, il faut y retourner
	//TODO: Retourner dans la Queue si l'instance de la partie a déjà été crée
	/* Vérifier à chaque connexion client s'il était en partie */

	/* ***************************************************************************** */
	/*                 Initialisation de la Game et des 2 joueurs                    */
	/* ***************************************************************************** */
	useEffect(() => {
		if (game) {
			setLoginLP(game.loginLP);
			setLoginRP(game.loginRP);
			setScoreLP(0);
			setScoreRP(0);
			setAbort(false);
			allPos.loginLP = game.loginLP;
			allPos.loginRP = game.loginRP;
			if (auth.user.name === allPos.loginLP && !lock) {
				setLock(true)
				intervalID = setInterval(tick, 1000);
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
					socket.emit("state", State.PAUSE);
					//TODO: Abort page ? Le joueur restant est donc gagnant
			}
		}
		// if ((allPos.state === State.LOSE || allPos.state === State.WIN) &&
		// 	x > allPos.width / 2 - 290 &&
		// 	x < allPos.width / 2 + 290 &&
		// 	y > allPos.height / 1.6 - 50 &&
		// 	y < allPos.height / 1.6
		// ) {
		// 	socket.emit("state", State.INIT);
		// }
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
		allPos.map = -1;
		allPos.key = key;
		let animationFrameId: number;
		allPos.img = new Image();
		var mignature = [new Image(), new Image(), new Image()];
		const gameBoards = [
			"https://emotionsnumeriques.files.wordpress.com/2017/04/srjc9512.jpg?w=640",
			"https://cdn.pocket-lint.com/r/s/1200x630/assets/images/149352-games-news-gwent-the-witcher-card-game-is-coming-to-ios-and-you-can-pre-order-it-for-free-now-image1-dkpsimikqa.jpg",
			"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8f138b7-dfde-4001-9305-eabae23b82ff/df6krl3-1950d728-786e-4aee-8504-bcd07f7c9b71.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2U4ZjEzOGI3LWRmZGUtNDAwMS05MzA1LWVhYmFlMjNiODJmZlwvZGY2a3JsMy0xOTUwZDcyOC03ODZlLTRhZWUtODUwNC1iY2QwN2Y3YzliNzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.PxPrKzBYn4B63khYSVcan9XNsDDaxoq0X2oRXWaIJNQ"];
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

		socket.on("updateImg", (mapPlayer) => {
			allPos.img.src = gameBoards[mapPlayer.index];
			allPos.map = mapPlayer.index;
			for (let index = 0; index < gameBoards.length; index++) {
				if (index === mapPlayer.index) {
					auth.user.name === mapPlayer.login ? color[index] = Colors.green : color[index] = Colors.red;
				}
				else {
					if (auth.user.name === mapPlayer.login && color[index] === Colors.green)
						color[index] = Colors.white;
					else if (auth.user.name !== mapPlayer.login && color[index] === Colors.red)
						color[index] = Colors.white;
				}
			}
		})

		socket.on("compteurUpdated", (currentSec) => {
			allPos.compteur = currentSec;
		})

		socket.on("launchGame", (map) => {
			allPos.compteur = -1;
			allPos.img.src = gameBoards[map];
			allPos.state = State.PLAY;
		});

		socket.on("endGame", (winner, capitulator) => {
			if (capitulator)
				//todo
			console.log("endGame")
			auth.user.name === winner ? allPos.state = State.WIN : allPos.state = State.LOSE ;//TODO: allPos ou pas ?
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
				socket.emit("update", allPos);
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
