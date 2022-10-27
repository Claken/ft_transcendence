import React, { useRef, useEffect, useState } from "react";
import { socket } from "../Socket";
import "../../styles/canvas.css"
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../axios.config";
import { IGame } from "../../interfaces/game.interface"
import { useParams } from "react-router-dom";

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
	const [drawCanvas, setdrawCanvas] = useState(false);
	const [game, setGame] = useState<IGame>(null);
	const auth = useAuth();
	const params = useParams();
	const [lock, setLock] = useState<boolean>(false);


	const quitGame = () => {
		//
	} //TODO:

	//TODO: Si la partie existe déjà, il faut y retourner
	//TODO: Retourner dans la Queue si l'instance de la partie a déjà été crée
	/* Vérifier à chaque connexion client s'il était en partie */
	useEffect(() => {
		console.log("useEffect pour connexion")
		const getGameById = async (id: number) => {
			await axios
				.get("/game/" + id)
				.then((res) => {
					setGame(res.data);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		if (!lock) {
			getGameById(Number(params));
			console.log("connexion Client");
		}
		return setLock(true);
	}, [])

	useEffect(() => {
		setLoginLP(game.loginLP);
		setLoginRP(game.loginRP);
	}, [game])

	/* ***************************************************************************** */
	/*                             requête axios                              */
	/* ***************************************************************************** */
	
	// socket.on("gameCreated", (game) => {
	// 	// setLoginLP(game.loginLP);
	// 	// setLoginRP(game.loginRP);
	// 	// console.log("loginLP = "+loginLP);
	// 	// console.log("loginRP = "+loginRP);

	// 	const postGames = async (newGame: IGame) => {
	// 		await axios
	// 			.post("/game", newGame)
	// 			.then((res) => {
	// 				let cpyGames = [...games];
	// 				cpyGames.push(res.data);
	// 				setGames(cpyGames);
	// 				console.log(res.data);
	// 			})
	// 			.catch((error) => {
	// 				console.log(error);
	// 			});
	// 	};
	// 	postGames(game);
	// })


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
		var state = 6; //etat du jeu TODO: mettre l'état à 6
		var key = "";
		var prev = "";
		var curr = "";
		var score = 5;
		var speed = 2;
		let animationFrameId: number;
		var img = new Image();
		var mignature0 = new Image();
		var mignature1 = new Image();
		var mignature2 = new Image();
		const gameBoards = [
			"https://emotionsnumeriques.files.wordpress.com/2017/04/srjc9512.jpg?w=640",
			"https://cdn.pocket-lint.com/r/s/1200x630/assets/images/149352-games-news-gwent-the-witcher-card-game-is-coming-to-ios-and-you-can-pre-order-it-for-free-now-image1-dkpsimikqa.jpg",
			"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8f138b7-dfde-4001-9305-eabae23b82ff/df6krl3-1950d728-786e-4aee-8504-bcd07f7c9b71.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2U4ZjEzOGI3LWRmZGUtNDAwMS05MzA1LWVhYmFlMjNiODJmZlwvZGY2a3JsMy0xOTUwZDcyOC03ODZlLTRhZWUtODUwNC1iY2QwN2Y3YzliNzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.PxPrKzBYn4B63khYSVcan9XNsDDaxoq0X2oRXWaIJNQ"];
		img.src = gameBoards[0];
		mignature0.src = gameBoards[0];
		mignature1.src = gameBoards[1];
		mignature2.src = gameBoards[2];
		const color = [];
		var compteur = 11;
		var timer;

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
			vx: vx,
			vy: vy,
			scoreLP: scoreLP,
			scoreRP: scoreRP,
			EmptyGround: EmptyGround,
			state: state,
			key: key,
			score: score,
			speed: speed,
			compteur: compteur,//TODO:
			img: img,//TODO:
		};

		/* ***************************************************************************** */
		/*                                Tableaux d'états                               */
		/* ***************************************************************************** */
		const State = {
			INIT:		0,
			PAUSE:		1,
			PLAY:		2,
			WIN:		3,
			LOSE:		4,
			ABORT:		5,
			WAITING:	6,
		};

		const Colors = {
			white:	"white",
			green:	"green",
			red:	"red",
		}

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
				if (x > width/2 - 600 && x < width/2 - 300 && y > 300 && y < 500) { //CLASSIC
					socket.emit("image", gameBoards[0]);
					// allPos.image = gameBoards[0];
					color[0] = Colors.green;
					color[1] = Colors.white;
					color[2] = Colors.white;
				}
				if (x > width/2 -150 && x < width/2 + 150 && y > 400 && y < 600) { //THEWITCHER
					socket.emit("image", gameBoards[1]);
					// allPos.image = gameBoards[1];
					color[0] = Colors.white;
					color[1] = Colors.green;
					color[2] = Colors.white;
				} 
				if (x > width/2 + 300 && x < width/2 + 600 && y > 300 && y < 500) { //POKEMON
					socket.emit("image", gameBoards[2]);
					// allPos.image = gameBoards[2];
					color[0] = Colors.white;
					color[1] = Colors.white;
					color[2] = Colors.green;
				}
			}
			else if (allPos.state === State.PAUSE || allPos.state === State.PLAY) {
				if (x > width / 2 - 150 - radius * 2 &&//button Pause/Play
					x < width / 2 - 150 + radius * 2 &&
					y > 25 - radius * 2 &&
					y < 25 + radius * 2) {
					if (allPos.state === State.PAUSE)
						socket.emit("state", State.PLAY);
					else
						socket.emit("state", State.PAUSE);
				}
				else if (//button stop
					x > width / 2 + 150 - radius * 2 &&
					x < width / 2 + 150 + radius * 2 &&
					y > 25 - radius * 2 &&
					y < 25 + radius * 2) {
						// allPos.compteur = 11;
						socket.emit("state", State.WAITING);
						//TODO: Abort page ? Le joueur restant est donc gagnant
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
		});

		socket.on("updatedPlayer", (newData) => {
			allPos.pLY = newData.pLY;
			allPos.pRY = newData.pRY;
		});

		socket.on("updatedState", (newState) => {
			allPos.state = newState;
		});

		socket.on("updateImg", (currentImg) => {//TODO:
			allPos.img.src = currentImg;
		})

		socket.on("compteurUpdated", (currentSec) => {//TODO:
			allPos.compteur = currentSec;
		})

		/* ***************************************************************************** */
		/*                   Affichage différent selon l'état du game                    */
		/* ***************************************************************************** */
		const initPage = () => {
			if (allPos.compteur === 11) {
				allPos.compteur -= 1;
				timer = window.setInterval(tick, 1000);//TODO:
			}
			allPos.ballX = ballX;
			allPos.ballY = ballY;
			allPos.scoreLP = scoreLP;
			allPos.scoreRP = scoreRP;
			allPos.pLY = pLY;
			allPos.pRY = pRY;
			allPos.vx = vx;
			allPos.vy = vy;
			allPos.speed = speed;

			context.fillStyle = "white";
			context.fillText("CHOOSE THE MAP", width / 2, height / 3, width);
			context.fillText(allPos.compteur.toString(), width / 2, height / 2.2);

			context.fillStyle = color[0]; //TODO: changer la couleur selon la sélection
			context.fillRect(width/2 - 610, 290, 320, 220);
			context.drawImage(mignature0, width/2 - 600, 300, 300, 200);
			context.fillText("CLASSIC", width/2 - 450, 560);

			context.fillStyle = color[1]; //TODO: changer la couleur selon la sélection
			context.fillRect(width/2 - 160, 390, 320, 220);
			context.drawImage(mignature1, width/2 -150, 400, 300, 200);
			context.fillText("THE WITCHER", width/2, 660);

			context.fillStyle = color[2]; //TODO: changer la couleur selon la sélection
			context.fillRect(width/2 + 290, 290, 320, 220);
			context.drawImage(mignature2, width/2 + 300, 300, 300, 200);
			context.fillText("POKEMON", width/2 + 450, 560);

			//TODO: Si temps du compteur passé, definir la map avec Math.floor(Math.random() * 3);
			//TODO: Ajouter au back la couleur du carré autour de l'image (vert?)
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

		const waitingPage = () => {
			context.fillStyle = "white";
			context.fillText("Waiting for opponent", width / 2, height / 2, width);
		};

		/* ***************************************************************************** */
		/*                            Affichage des boutons                              */
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

		function tick() {//TODO: elle est exécuté deux fois, car les deux users l'appel
			if (allPos.compteur === 0) {
				window.clearInterval(timer);
				socket.emit("state", State.PLAY);
			}
			else
				socket.emit("compteur", allPos.compteur);
		}

		/* ***************************************************************************** */
		/*                      Fonction principale de l'affichage                       */
		/* ***************************************************************************** */
		function render() {
			context.clearRect(0, 0, width, height);
			context.fillStyle = "black";
			context.fillRect(0, 50, width, height);
			context.drawImage(allPos.img, 0, 50, width, height);

			const user = auth.user;

			if (allPos.state === State.INIT) {
				initPage();
			} else if (allPos.state === State.PAUSE) {
				button();
				pausePage();
			}
			else if (allPos.state === State.WAITING)
				waitingPage();
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
			if (allPos.state !== State.INIT)
				context.fillRect(allPos.ballX, allPos.ballY, allPos.ballW, allPos.ballH);
			context.fill();
			context.fillRect(1, allPos.pLY, paddleW, paddleH);
			if (allPos.state !== State.WAITING)
			context.fillRect(width - paddleW, allPos.pRY, paddleW - 1, paddleH);
			context.strokeStyle = "white";
			context.moveTo(width / 2, 50);
			context.lineTo(width / 2, height);
			if (allPos.state !== State.INIT && img.src !== gameBoards[2])
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
		};
	},[drawCanvas]);

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
