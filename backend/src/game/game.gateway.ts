import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit
} from '@nestjs/websockets';
import { UserDTO } from "../TypeOrm/DTOs/User.dto"
import { GameDTO} from "../TypeOrm/DTOs/Game.dto"
import { GameService } from './game.service';
import { Socket } from 'dgram';

export var userQueue = [];

@WebSocketGateway({cors: "http://localhost:3000"})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer() server;
	users: number = 0;

	afterInit(server: any) {
		console.log("Server Initialized");
		this.server.to(1).emit("toto");//TODO:
	}

	async handleConnection(client) {//assigner un numéro dans la bdd pour l'utiliser ici
		// A client has connected
		this.users++;
		// Notify connected clients of current users
		this.server.emit('users', this.users);
		console.log("user n°" + this.users + " " + client.id + " connected");
	}

	async handleDisconnect(client) {//assigner un numéro dans la bdd pour l'utiliser ici
		// A client has disconnected
		// Notify connected clients of current users
		this.server.emit('users', this.users);
		console.log("user n°" + this.users + " " + client.id + " disconnected");
		this.users--;
	}

	@SubscribeMessage('update')
	async moveBall(client: any, allPos) {
		/* ********************************************************************* */
		/*          var pour facilement identifier les côtés de la balle         */
		/* ********************************************************************* */
		let	left = allPos.ballX,
			right = allPos.ballX + allPos.ballW,
			top = allPos.ballY,
			bot = allPos.ballY + allPos.ballH

		/* ********************************************************************* */
		/*         Détection des colisions sur bord en Y et paddles en X         */
		/* ********************************************************************* */
		//Colisions haut et bas
		if (top - allPos.EmptyGround < 0 || bot > allPos.height) {
			allPos.vy *= -1;
			//TODO: emmettre un son
		}

		//Colisions joueur Gauche
		if(allPos.ballX <= 1 + allPos.paddleW) {
			if((allPos.ballY + allPos.ballH >= allPos.pLY) && (allPos.ballY <= allPos.pLY + allPos.paddleH)){
				allPos.vx = 1;
				//TODO: emmettre un son
				allPos.speed < 5 ? allPos.speed += 0.2 : null;
				console.log("speed = " + allPos.speed) //TODO: retirer
			}
		}

		//Colisions joueur Droit
		if(allPos.ballX + allPos.ballW >= allPos.width - (1 + allPos.paddleW)) {
			if((allPos.ballY + allPos.ballH >= allPos.pRY) && (allPos.ballY <= allPos.pRY + allPos.paddleH)){
				allPos.vx = -1;
				//TODO: emmettre un son
				allPos.speed < 5 ? allPos.speed += 0.2 : null;
				console.log("speed = " + allPos.speed) //TODO: retirer
			}
		}

		// Si l'état du jeu est différent de WIN ou LOSE
		if (allPos.state != 3 && allPos.state != 4) {
			// Si la balle sort du terrain de droite
			if (right > allPos.width) {
				allPos.scoreLP++;
				if (allPos.scoreLP >= allPos.score)
					allPos.state = 4 //TODO: gagnant/perdant en fonction de joueur et pas du side.
				if (allPos.state != 3 && allPos.state != 4)
					allPos.ballX = allPos.width/2;
				allPos.speed = 2;
				allPos.vx *= -1;//TODO: à retirer.
			}
			// Si la balle sort du terrain de gauche
			if (left < 0) {
				allPos.scoreRP++;
				if (allPos.scoreRP >= allPos.score)
					allPos.state = 3 //TODO: gagnant/perdant en fonction de joueur et pas du side.
				if (allPos.state != 3 && allPos.state != 4)
					allPos.ballX = allPos.width/2;
				allPos.speed = 2;
			}
			allPos.ballX += allPos.vx * allPos.speed;
			allPos.ballY += allPos.vy * allPos.speed;
		}
		this.server.emit("updatedData", allPos);
	}

/* ***************************************************************************** */
/*                    Mouvement des paddles gauche et droite.                    */
/* ***************************************************************************** */
	@SubscribeMessage('movePlayer')
	async PaddleUp(client: any, allPos) {
	//TODO: En fonction de l'userID, le paddle Gauche ou Droit bouge
		if (allPos.key === "ArrowUp" || allPos.key === "w" || allPos.key === "W"
			|| allPos.key === "z" || allPos.key === "Z") {
			allPos.pLY -= 6;
			if (allPos.pLY < 0 + allPos.EmptyGround)
				allPos.pLY = 0 + allPos.EmptyGround;
		}
		if (allPos.key === "ArrowDown" || allPos.key === "s" || allPos.key === "S") {
			allPos.pLY += 6;
			if (allPos.pLY + allPos.paddleH > allPos.height)
				allPos.pLY = allPos.height - allPos.paddleH;
			}
		this.server.emit("updatedPlayer", allPos);
	}

/* ***************************************************************************** */
/*                    Mise à jours du state pour les joueurs                     */
/* ***************************************************************************** */
	@SubscribeMessage('state')
	async State(client: any, currentState) {
		this.server.emit("updatedState", currentState);
	}

/* ***************************************************************************** */
/*                         maj des images et du compteur                         */
/* ***************************************************************************** */
	@SubscribeMessage('image')
	async Image(client: any, currentImg) {
		this.server.emit("updateImg", currentImg);
	}

	@SubscribeMessage('compteur')
	async UpdateCompteur(client: any, currentSec) {
		currentSec -= 1;
		this.server.emit("compteurUpdated", currentSec);
	}

/* ***************************************************************************** */
/*                   Rejoindre la userQueue et créer une game                    */
/* ***************************************************************************** */
	@SubscribeMessage('joinQueue')//TODO:
	async JoinQueue(client: any, user: UserDTO) {
		let name = user.name
		console.log("Name ="+name)
		if (!userQueue.find(user => user.name === name)) {
			console.log("Ajout du user: "+user.name)
			userQueue.push(user);
		}
		user.inQueue = true;
		console.log("userQueue.length: "+userQueue.length);
		if (userQueue.length % 2 === 0) {
			console.log("Création de la partie. Les deux joueurs se regrp");//TODO: retirer
			console.log("user name 1 = "+userQueue[0].name)//TODO: retirer
			console.log("user name 2 = "+userQueue[1].name)//TODO: retirer
			await this.CreateNewGame(client, userQueue[0], userQueue[1]);
		}
	}

	@SubscribeMessage('createNewGame')
	async CreateNewGame(client: any, user1: UserDTO, user2: UserDTO) {
		userQueue.slice(0, 2);//TODO: vérifier de bien supprimer les users
		console.log("CreateNewGame");
		console.log("user id 1 = "+user1.id);//TODO:
		console.log("user id 2 = "+user2.id);//TODO:
		const newGame: GameDTO = {
			loginLP: user1.name,
			loginRP: user2.name,
		}
		user1.inQueue = false;
		user2.inQueue = false;
		user1.inGame = true;
		user2.inGame = true;
		this.server.emit("gameCreated", newGame);
	}

	@SubscribeMessage('checkGames')//TODO:
	CheckGames(client: any, pendingGames: GameDTO[]) {
		if (pendingGames.length > 0) {
			this.server.emit("goPlay", pendingGames[0]);
		}
		else {
			this.server.emit("waitForOpponent") //Waitroom?
		}
	}
}
