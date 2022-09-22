import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from "./Socket";
import "../styles/canvas.css"

const Game = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.CanvasHTMLAttributes<HTMLCanvasElement>) => {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	let	CanvasWidth = 1600;
	let	CanvasHeight = 760;
	let EmptyGround = 50 / 2;
	// const [playerL, setPlayerL] = useState(0); // avoir le profil du user
	// const [playerR, setPlayerR] = useState(0); // avoir le profil du user
	const [loginLP, setLoginLP] = useState('Player 1'); // avoir le login du joueur de gauche pour l'afficher
	const [loginRP, setLoginRP] = useState('Player 2'); // avoir le login du joueur de droite pour l'afficher
	const [scoreLP, setScoreLP] = useState(0); // Score du joueur gauche
	const [scoreRP, setScoreRP] = useState(0); // Score du joueur droit

	//TODO: créer un tableau pour y stocker toutes les infos nécessaire à envoyer à la bdd

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
			context.fillText(scoreLP + ' - ' + scoreRP, width / 2, 45); // applique le texte à l'endroit voulu dans le rectangle

					/* Affichage balle et de la ligne centrale*/
			context.beginPath();
			context.fillStyle = 'white';
			context.arc(ballX,ballY,10,0,Math.PI*2); //balle //TODO: Donner les positions stockées dans la bdd
			// if (ballX == width)
			// 	ballX = 0;
			// ballX=ballX+1;
			context.fill();
			context.fillRect(width - paddleLarge, posHR, paddleLarge-1, paddleSize); //paddle gauche //TODO: Donner les positions stockées dans la bdd
			context.fillRect(1, posHL, paddleLarge, paddleSize); //paddle droit //TODO: Donner les positions stockées dans la bdd

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
