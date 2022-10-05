import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit
} from '@nestjs/websockets';

@WebSocketGateway({cors: "http://localhost:3000"})//front ?
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer() server;
	users: number = 0;

	afterInit(server: any) {
		console.log("Server Initialized");
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
	async moveBall(client: any, allPos) { //quel est le premier param ?
		//var pour facilement identifier les côtés de la balle
		let	left = allPos.ballX - allPos.radius,
			right = allPos.ballX + allPos.radius,
			top = allPos.ballY - allPos.radius,
			bot = allPos.ballY + allPos.radius

		//var pour facilement identifier les côtés du joueur gauche
		let	pL_left = 1 - allPos.radius / 2,
			pL_right = 1 + allPos.paddleW / 2,
			pL_top = (allPos.pLY + allPos.EmptyGround) - allPos.paddleH / 2,
			pL_bot = (allPos.pLY + allPos.EmptyGround) + allPos.paddleH / 2

		//var pour facilement identifier les côtés du joueur droit
		let	pR_left = (allPos.width - 1) - allPos.paddleW / 2,
			pR_right = (allPos.width - 1) + allPos.paddleW / 2,
			pR_top = (allPos.pRY + allPos.EmptyGround) - allPos.paddleH / 2,
			pR_bot = (allPos.pRY + allPos.EmptyGround) + allPos.paddleH / 2

		//détection bord en Y
		if (bot > allPos.height || top - allPos.EmptyGround < 0) {
			allPos.vy *= -1;
		}

		//joueur gauche et droit en X
		if ((left < pL_right && right > pL_left && top < pL_bot && bot > pL_top)
			|| (left < pR_right && right > pR_left && top < pR_bot && bot > pR_top)) {
				allPos.vx *= -1;
				console.log(allPos.vx);
		}
		else if (right > allPos.width) {
			allPos.ballX = allPos.width/2;
			allPos.scoreLP++;
			// allPos.vx *= -1;//todo
		}
		else if (left < 0) {
			allPos.ballX = allPos.width / 2;
			allPos.scoreRP++;
		}

		//assignation finale de la valeur
		allPos.ballX += allPos.vx;
		allPos.ballY += allPos.vy;
		this.server.emit("updatedData", allPos);
	}

	@SubscribeMessage('movePlayer')
	async PaddleUp(client: any, allPos) {
		/*
			En fonction de l'userID, le paddle Gauche ou Droit bouge
		*/
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

	@SubscribeMessage('notification')
	async test() {
		console.log("tata");
	}
}
