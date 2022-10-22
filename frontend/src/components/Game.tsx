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
		var pLY = height/2 - EmptyGround/2;		//placement en hauteur du paddle gauche (joueur gauche)
		var pRY = height/2 - EmptyGround/2;		//placement en hauteur du paddle droit (joueur droit)
		var paddleH = height/7;					//hauteur du paddle
		var paddleW = width/100;				//largeur du paddle
		var radius = 10;						//taille de la balle
		var ballX = width / 2;					//placement en X de la balle
		var ballY = height / 2 + EmptyGround/2;	//placement en Y de la balle
		var vx = 2;
		var vy = 2;
		var state = 2;
		var key = "";
		var prev = "";
		var curr = "";

		//Tab qui va etre envoye au back a chaque update de la ball et des paddle
		const allPos = {
			radius: radius,
			width:width,
			height:height,
			paddleW:paddleW,
			paddleH:paddleH,
			pLY:pLY,
			pRY:pRY,
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
			if (e.key === "ArrowUp" || e.key === "ArrowDown"
				|| e.key === "w" || e.key === "s" || e.key === "z"
				|| e.key === "W" || e.key === "S" || e.key === "Z") {
				e.preventDefault();
				if (curr != e.key)
					prev = curr;
				allPos.key = e.key;
				curr = allPos.key;
				// console.log("PRESS: key = " + e.key + ". Prev = " + prev); //TODO:
			}
		}

		const stopPlayer = e => {
			if (e.key === "ArrowUp" || e.key === "ArrowDown"
				|| e.key === "w" || e.key === "s" || e.key === "z"
				|| e.key === "W" || e.key === "S" || e.key === "Z") {
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
		socket.on("updatedData", newData => {
			allPos.ballX = newData.ballX;
			allPos.ballY = newData.ballY;
			allPos.vy = newData.vy;
			allPos.vx = newData.vx;
			allPos.scoreLP = newData.scoreLP
			allPos.scoreRP = newData.scoreRP
		});

		// Update des joueurs
		socket.on("updatedPlayer", newData => {
			allPos.pLY = newData.pLY;
			allPos.pRY = newData.pRY;
		});

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
			if (allPos.key === "ArrowUp" || allPos.key === "ArrowDown"
				|| allPos.key === "w" || allPos.key === "W"
				|| allPos.key === "s" || allPos.key === "S"
				|| allPos.key === "z" || allPos.key === "Z")
					socket.emit("movePlayer", allPos);
			socket.emit("update", allPos);
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
			context.fillText(allPos.scoreLP + ' - ' + allPos.scoreRP, width / 2, 45);// applique le texte à l'endroit voulu dans le rectangle
			context.fillText(allPos.ballX + ' X ' + allPos.ballY, 600 / 2, 45);
			context.fillText(allPos.width + ' X ' + allPos.height, 1200 / 2, 45);

					/* Affichage balle/paddle/ligne centrale*/
			context.beginPath();
			context.fillStyle = 'white';
			context.arc(allPos.ballX, allPos.ballY, radius, 0, Math.PI*2); //balle
			context.fill();
			context.fillRect(1, allPos.pLY, paddleW, paddleH); //paddle gauche
			context.fillRect(width - paddleW, allPos.pRY, paddleW-1, paddleH); //paddle droit
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
