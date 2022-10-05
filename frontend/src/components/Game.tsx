import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from "./Socket";
import "../styles/canvas.css"
import { Server } from 'tls';

const Game = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.CanvasHTMLAttributes<HTMLCanvasElement>) => {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	let	CanvasWidth = 1600;
	let	CanvasHeight = 760;
	let EmptyGround = 50;
	// const [playerL, setPlayerL] = useState(0); // avoir le profil du user
	// const [playerR, setPlayerR] = useState(0); // avoir le profil du user
	const [loginLP, setLoginLP] = useState('Player 1'); // avoir le login du joueur de gauche pour l'afficher
	const [loginRP, setLoginRP] = useState('Player 2'); // avoir le login du joueur de droite pour l'afficher
	const [scoreLP, setScoreLP] = useState(0); // Score du joueur gauche
	const [scoreRP, setScoreRP] = useState(0); // Score du joueur droit
	
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null)
		return;
		const context = canvas.getContext("2d");
		if (context == null)
		return;
		var width = canvas.width;				//largeur du canvas
		var height = canvas.height;				//hauteur du canvas
		var posHL = height/2 - EmptyGround/2;	//placement en hauteur du paddle gauche (joueur gauche)
		var posHR = height/2 - EmptyGround/2;	//placement en hauteur du paddle droit (joueur droit)
		var paddleSize = height/7;				//hauteur du paddle
		var paddleLarge = width/100;			//largeur du paddle
		var radius = 10;						//taille de la balle
		var ballX = width / 2;					//placement en X de la balle
		var ballY = height / 2 + EmptyGround/2;	//placement en Y de la balle
		var vx = -3;
		var vy = 3;
		var state = 2;
		var key = "";
		var prev = "";
		var curr = "";

		//Tab qui va etre envoye au back a chaque update de la ball et des paddle
		const allPos = {
			radius: radius,
			width:width,
			height:height,
			paddleLarge:paddleLarge,
			paddleSize:paddleSize,
			posHL:posHL,
			posHR:posHR,
			ballX:ballX,
			ballY:ballY,
			scoreLP:scoreLP,
			scoreRP:scoreRP,
			vx:vx,
			vy:vy,
			EmptyGround:EmptyGround,
			state:state,
			key:key,
		};

		let animationFrameId: number;

		/* Tableau d'état pour savoir où en est le jeu */
		const State = {
			INIT: 0,
			PAUSE: 1,
			PLAY: 2,
			WIN: 3,
			LOSE: 4,
		};

		// Ajout d'event pour écouter les évènements que je définie
		const movePlayer = e => {
			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault();
				if (curr != e.key)
					prev = curr;
				allPos.key = e.key;
				curr = allPos.key;
				// console.log("PRESS: key = " + e.key + ". Prev = " + prev); //TODO:
			}
		}

		const stopPlayer = e => {
			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault();
				if (e.key !== prev)
					curr = prev;
				allPos.key = curr;
				prev = "";
				// console.log("RELEASE: key = " + allPos.key+ ". Prev = " + prev); //TODO:
			}
		}

		document.addEventListener('keydown', movePlayer);
		document.addEventListener('keyup', stopPlayer);

		// Update positions
		socket.on("updatedPos", newPos => {
			allPos.ballX = newPos.ballX;
			allPos.ballY = newPos.ballY;
			allPos.vy = newPos.vy;
			allPos.vx = newPos.vx;
		});

		// Update des joueurs
		socket.on("updatedPlayer", newPos => {
			allPos.posHL = newPos.posHL;
			allPos.posHR = newPos.posHR;
		});

		// // Update du joueur droit
		// socket.on("updateRP", newPos => {
		// 	allPos.posHR = newPos;
		// });

		function render() {
			// switch (state) {
			// 	case State.INIT:
			// 		return (initpage());
			// 	case State.PAUSE:
			// 		return (pausepage());
			// 	case State.LOSE:
			// 		return (losepage());
			// 	case State.WIN:
			// 		return (winpage());
			// 	case State.PLAY:
			// 		break;
			// }
			if (context == null)
				return;
			if (allPos.key === "ArrowUp" || allPos.key === "ArrowDown")
				socket.emit("movePlayer", allPos);
			// if (key === "ArrowDown")
			// 	socket.emit("moveDown", allPos);
			socket.emit("pos", allPos);
			context.clearRect(0, 0, width, height); // nettoie la zone spécifiée pour redessiner au propre par dessus
			context.fillStyle = "black" // assigne la couleur noir au prochain dessin/texte
			context.fillRect(0, 50, width, height) // créer un rectangle de taille width X height

			/* Affichage des joueurs et du score */
			context.font = "40px Roboto";
			context.fillStyle = "black";
			context.textAlign = 'start'; // affiche le login au plus à gauche
			context.fillText(loginLP, 0, 40); //affiche le login du joueur de gauche
			context.textAlign = 'end'; // affiche le login au plus à droite
			context.fillText(loginRP, width, 40); //affiche le login du joueur de droite
			context.textAlign = 'center'; // affiche le login au plus au centre
			context.font = "60px Roboto"; // applique une police pour le texte suivant
			// context.fillText(allPos.scoreLP + ' - ' + allPos.scoreRP, width / 2, 45);// applique le texte à l'endroit voulu dans le rectangle
			context.fillText(allPos.ballX + ' X ' + allPos.ballY, 600 / 2, 45);
			context.fillText(allPos.width + ' X ' + allPos.height, 1200 / 2, 45);

					/* Affichage balle/paddle/ligne centrale*/
			context.beginPath();
			context.fillStyle = 'white';
			context.arc(allPos.ballX, allPos.ballY, radius, 0, Math.PI*2); //balle
			context.fill();
			context.fillRect(width - paddleLarge, allPos.posHR, paddleLarge-1, paddleSize); //paddle gauche
			context.fillRect(1, allPos.posHL, paddleLarge, paddleSize); //paddle droit
			context.strokeStyle = 'white';
			context.moveTo(width/2, 50);
			context.lineTo(width/2, height);
			context.stroke(); //ligne centrale
			context.closePath();

			animationFrameId = window.requestAnimationFrame(render);
		}
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener('keyMove', movePlayer);
		}
	}, [])

	return (
		<div>
		<canvas ref={canvasRef} width={CanvasWidth} height={CanvasHeight}  {...props}/>
		</div>
	)
}

export default Game
