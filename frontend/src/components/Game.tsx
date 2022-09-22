import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from "./Socket";
import "../styles/canvas.css"

const Game = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.CanvasHTMLAttributes<HTMLCanvasElement>) => {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	let	CanvasWidth = 1600;
	let	CanvasHeight = 760;
	let EmptyGround = 50 / 2;
	const [playerL, setPlayerL] = useState(0); // avoir le login pour l'afficher
	const [playerR, setPlayerR] = useState(0); // avoir le login pour l'afficher
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
		var posHL = height/2 - EmptyGround;		//placement en hauteur du paddle gauche (joueur gauche)
		var posHR = height/2 - EmptyGround;		//placement en hauteur du paddle droit (joueur droit)
		var ballX = width / 2;					//placement en X de la balle
		var ballY = height / 2 + EmptyGround;	//placement en Y de la balle
		var paddleSize = height/7;				//hauteur du paddle
		var paddleLarge = width/100;			//largeur du paddle

		//TODO: avoir un affichage pour des états de jeu différents, comme une victoire, defaites, leave, etc...
		
		let animationFrameId: number;
		
		function render() {
			if (context == null)
				return;
			// context.clearRect(0, 50, width, height); // clean le rectangle pour redessiner dessus après une écriture par exemple ? TODO: nécessaire ???
			/* Affichage de base pour le PONG */
			context.fillStyle = "black" // assigne la couleur noir au rectangle
			context.fillRect(0, 50, width, height) // créer un rectangle de taille width X height
			context.font = "120px Roboto"; // applique une police pour le texte suivant
			context.fillStyle = "white"; // applique une couleur pour le texte
			// context.fillText("PONG", width/2.5, height/4); // applique le texte à l'endroit voulu dans le rectangle

					/* Affichage des joueurs */
			context.font = "30px Roboto"; // applique une police pour le texte suivant
			context.fillStyle = "black"; // applique une couleur pour le texte
			context.fillText("Player 1", width/4.5, 30);
			context.fillText("Player 2", width/2 + width/4.5, 30);

					/* Affichage balle et de la ligne centrale*/
			context.beginPath();
			context.fillStyle = 'white';
			context.arc(ballX,ballY,10,0,Math.PI*2); //balle
			// if (ballX == width)
			// 	ballX = 0;
			// ballX=ballX+1;
			context.fill();
			context.fillRect(width - paddleLarge, posHR, paddleLarge-1, paddleSize); //paddle gauche
			context.fillRect(1, posHL, paddleLarge, paddleSize); //paddle droit

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
		}
	}, [])

	return (
		<div>
		<canvas ref={canvasRef} width={CanvasWidth} height={CanvasHeight}  {...props}/>
		</div>
	)
}

export default Game
