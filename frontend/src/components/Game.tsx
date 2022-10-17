import React, { useRef, useEffect, useState } from "react";
import axios from "axios"; //TODO:
import { socket } from "./Socket";
import "../styles/canvas.css";
import { Server } from "tls"; //TODO:
import { IGame } from '../interfaces/game.interface'

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
	const [games, setGames] = useState<IGame[]>([]);
	const [game, setGame] = useState<IGame>(null);
	// const toto = props.dataFromPa
	const keysPressed: boolean[] = [];

	const addGame = () => {
		const cpyGames = [...games];
		setGame({loginLP: loginLP, loginRP: loginRP});
		cpyGames.push(game);
		setGames(cpyGames);
	}

	useEffect(() => {
		// Créer 
		axios.post('http://localhost:3001/game', game);
	}, [games])

	useEffect(() => {
		// axios
		const MYLOGIN = axios.get('http://localhost:3001/game') 
	}, [games])

/* ***************************************************************************** */
/*                             USEEFFECT PRINCIPALE                              */
/* ***************************************************************************** */
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null) return;
		const context = canvas.getContext("2d");
		if (context == null) return;
		var width = canvas.width; //largeur du canvas
		var height = canvas.height; //hauteur du canvas
		var pLY = height / 2 - EmptyGround / 2; //placement en hauteur du paddle gauche
		var pRY = height / 2 - EmptyGround / 2; //placement en hauteur du paddle droit
		var paddleH = height / 8; //hauteur du paddle
		var paddleW = width / 150; //largeur du paddle
		const radius = 10; //taille de la balle
		var ballW = 15; //largeur de la balle
		var ballH = ballW; //hauteur de la balle
		var ballX = (width / 2) - (ballW / 2); //placement en X de la balle
		var ballY = height / 2 + EmptyGround / 2; //placement en Y de la balle
		var vx = -1; //vitesse en X de la balle
		var vy = -1; //vitesse en Y de la balle
		var state = 0; //etat du jeu
		var key = "";
		var prev = "";
		var curr = "";
		var score = 5;
		var speed = 2;
		var compteur = 10;
		let animationFrameId: number;

		/* ***************************************************************************** */
		/*    Tab qui va etre envoye au back a chaque update de la ball et des paddle    */
		/* ***************************************************************************** */
		const allPos = {
			width: width,
			height: height,
			paddleW: paddleW,
			paddleH: paddleH,
			pLY: pLY,
			pRY: pRY,
			ballW: ballW,
			ballH: ballH,
			ballX: ballX,
			ballY: ballY,
			scoreLP: scoreLP,
			scoreRP: scoreRP,
			vx: vx,
			vy: vy,
			EmptyGround: EmptyGround,
			state: state,
			key: key,
			score: score,
			speed: speed,
			compteur: compteur,
		};

		/* ***************************************************************************** */
		/*                  Tableau d'état pour savoir où en est le jeu                  */
		/* ***************************************************************************** */
		const State = {
			INIT: 0,
			PAUSE: 1,
			PLAY: 2,
			WIN: 3,
			LOSE: 4,
			ABORT: 5,
		};

		/* ***************************************************************************** */
		/*                                 Requête AXIOS                                 */
		/* ***************************************************************************** */

		//axios
		// const MYLOGIN = axios.get('http://localhost:3001/game')

		/* ***************************************************************************** */
		/*            Ajout d'event pour écouter les touches/cliques entrant             */
		/* ***************************************************************************** */
		const pauseGame = (e) => {
			if (e.key === "p"|| e.key === "P" || e.key === " ") {
				e.preventDefault();
				if (allPos.state === State.PLAY)
					socket.emit("state", State.PAUSE);
				else if (allPos.state === State.PAUSE)
					socket.emit("state", State.PLAY);
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
				if (curr != e.key) prev = curr;
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

			if (
				allPos.state === State.INIT &&
				x > width / 2 - 200 &&
				x < width / 2 + 200 &&
				y > height / 2 - 50 &&
				y < height / 2
			)
				socket.emit("state", State.PLAY);
			else if (allPos.state === State.PAUSE || allPos.state === State.PLAY) {
				if (x > width / 2 - 150 - radius * 2 &&
					x < width / 2 - 150 + radius * 2 &&
					y > 25 - radius * 2 &&
					y < 25 + radius * 2) {
					if (allPos.state === State.PAUSE)
						socket.emit("state", State.PLAY);
					else
						socket.emit("state", State.PAUSE);
				}
				else if (
					x > width / 2 + 150 - radius * 2 &&
					x < width / 2 + 150 + radius * 2 &&
					y > 25 - radius * 2 &&
					y < 25 + radius * 2) {
						socket.emit("state", State.INIT);
				}
			}
			if ((allPos.state === State.LOSE || allPos.state === State.WIN) &&
				x > width / 2 - 290 &&
				x < width / 2 + 290 &&
				y > height / 1.6 - 50 &&
				y < height / 1.6
			) {
				socket.emit("state", State.INIT);
			}
		};

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
			allPos.compteur = newData.compteur;
		});

		socket.on("updatedPlayer", (newData) => {
			allPos.pLY = newData.pLY;
			allPos.pRY = newData.pRY;
		});

		socket.on("updatedState", (newState) => {
			allPos.state = newState;
		});

		/* ***************************************************************************** */
		/*                   Affichage différent selon l'état du game                    */
		/* ***************************************************************************** */
		const initPage = () => {
			context.fillStyle = "white";
			context.fillText("CLICK TO START", width / 2, height / 2, width);
			allPos.ballX = ballX;
			allPos.ballY = ballY;
			allPos.scoreLP = scoreLP;
			allPos.scoreRP = scoreRP;
			allPos.pLY = pLY;
			allPos.pRY = pRY;
			allPos.vx = vx;
			allPos.vy = vy;
			allPos.speed = speed;
			//if (user == 0)
			//allPos.loginLP = ...;
			//else
			//allPos.loginLP = ...;
			//TODO: Choix de la map PUIS ensuite cliquer pour démarrer la partie ?
		};

		const pausePage = () => {
			context.fillStyle = "white";
			context.fillText("PAUSE", width / 2, height / 2, width);
		};

		const losePage = () => {
			context.fillStyle = "red";
			context.fillText("You LOSE", width / 2, height / 2.2, width);
			context.fillStyle = "white";
			context.fillText(
				"CLICK to restart a game",
				width / 2,
				height / 1.6,
				width
			);
		};

		const winPage = () => {
			context.fillStyle = "green";
			context.fillText("You WIN", width / 2, height / 2.2, width);
			context.fillStyle = "white";
			context.fillText("CLICK to restart a game", width / 2, height / 1.6, width);
		};

		const abortPage = () => {
			context.fillStyle = "white";
			context.fillText("ABORT", width / 2, height / 2, width);
		};

		/* ***************************************************************************** */
		/*                   Affichage des boutons PAUSE/PLAY et STOP                    */
		/* ***************************************************************************** */
		const button = () => {
			context.beginPath();
			context.fillStyle = "black";
			context.arc(width / 2 - 150, 25, radius * 2, 0, Math.PI * 2);
			context.arc(width / 2 + 150, 25, radius * 2, 0, Math.PI * 2);
			context.fill();
			context.fillStyle = "white";
			context.fillRect(width / 2 + 142.5, 17.5, 15, 15);
			if (allPos.state === State.PAUSE) {
				context.beginPath();
				context.moveTo(width / 2 - 155, 15);
				context.lineTo(width / 2 - 155, 35);
				context.lineTo(width / 2 - 140, 25);
				context.fill();
				context.closePath();
			}
			if (allPos.state === State.PLAY) {
				context.fillRect(width / 2 - 160, 15, 8, 20);
				context.fillRect(width / 2 - 148, 15, 8, 20);
			}
		};

		/* ***************************************************************************** */
		/*                      Fonction principale de l'affichage                       */
		/* ***************************************************************************** */
		function render() {
			context.clearRect(0, 0, width, height);
			context.fillStyle = "black";
			context.fillRect(0, 50, width, height);
			if (allPos.state === State.INIT) {
				initPage();
			} else if (allPos.state === State.PAUSE) {
				button();
				pausePage();
			}
			else if (allPos.state === State.LOSE)
				losePage();
			else if (allPos.state === State.WIN)
				winPage();
			else if (allPos.state === State.PLAY) {
				button();
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
					socket.emit("movePlayer", allPos);
				socket.emit("update", allPos);
			}
			context.font = "40px Roboto";
			context.fillStyle = "black";
			context.textAlign = "start";
			context.fillText(loginLP, 0, 40);
			context.textAlign = "end";
			context.fillText(loginRP, width, 40);
			context.textAlign = "center";
			context.font = "60px Roboto";
			context.fillText(allPos.scoreLP + " - " + allPos.scoreRP, width / 2, 45);
			context.beginPath();
			context.fillStyle = "white";
			context.fillRect(allPos.ballX, allPos.ballY, allPos.ballW, allPos.ballH);
			context.fill();
			context.fillRect(1, allPos.pLY, paddleW, paddleH);
			context.fillRect(width - paddleW, allPos.pRY, paddleW - 1, paddleH);
			context.strokeStyle = "white";
			context.moveTo(width / 2, 50);
			context.lineTo(width / 2, height);
			context.stroke();
			animationFrameId = window.requestAnimationFrame(render);
		}
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keyMove", movePlayer);
		};
	}, []);

	/* ***************************************************************************** */
	/*                          balise HTML de la page web                           */
	/* ***************************************************************************** */
	return (
		//afficher le plateau de jeu lorsque l'user click sur le bouton
		//
		<div>
			{game ? null : <canvas
				ref={canvasRef}
				width={CanvasWidth}
				height={CanvasHeight}
				{...props}
			/>}
			<div><button onClick={addGame}>Join a Game</button></div>
			<div>{game ? game.loginLP : null}</div>
		</div>
		
	);
};

export default Game;
