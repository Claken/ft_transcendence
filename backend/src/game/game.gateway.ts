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

	@SubscribeMessage('toto')
	async printToto(client: any, key : number) {
		console.log("toto + " + key);
	}

	@SubscribeMessage('pos')
	async moveBall(client: any, allPos) { //quel est le premier param ?
		//détection bord en Y
		if (allPos.ballY + allPos.radius > allPos.height
			|| allPos.ballY - allPos.radius - allPos.EmptyGround < 0) {
			allPos.vy *= -1;
		}
		
		// détection bord en X (paddle du joueur droit)
		// détection bord en X (paddle du joueur gauche)
		//détection bord en X
		if ((allPos.ballX - allPos.radius <= 0 + allPos.paddleLarge)
			|| (allPos.ballX + allPos.radius >= allPos.width - allPos.paddleLarge)
			) {
			allPos.vx *= -1;
		}
		else if (allPos.ballX + allPos.radius === allPos.width || allPos.ballX <= 0) {
			allPos.ballX = allPos.width/2;
		}

		//assignation finale de la valeur
		allPos.ballX += allPos.vx;
		allPos.ballY += allPos.vy;
		this.server.emit("updatedPos", allPos);
	}

	@SubscribeMessage('movePlayer')
	async PaddleUp(client: any, allPos) {
		if (allPos.key === "ArrowUp") {
			allPos.posHL -= 4;
			if (allPos.posHL < 0 + allPos.EmptyGround)
				allPos.posHL = 0 + allPos.EmptyGround;
		}
		if (allPos.key === "ArrowDown") {
			allPos.posHL += 4;
			if (allPos.posHL + allPos.paddleSize > allPos.height)
				allPos.posHL = allPos.height - allPos.paddleSize;
			}
		this.server.emit("updatedPlayer", allPos);
	}

	@SubscribeMessage('moveDown')
	async PaddleDown(client: any, allPos) {
		if (allPos.state == 2) {
			allPos.posHL += 4;
			if (allPos.posHL + allPos.paddleSize > allPos.height)
				allPos.posHL = allPos.height - allPos.paddleSize;
			this.server.emit("updatedPlayer", allPos);
		}
	}

	@SubscribeMessage('notification')
	async test() {
		console.log("tata");
	}
}
