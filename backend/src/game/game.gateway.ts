import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit
} from '@nestjs/websockets';

@WebSocketGateway({cors: "http://localhost:3001"})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer() server;
	users: number = 0;

	afterInit(server: any) {
		console.log("Initialized i guess");
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
	async printToto() {
		console.log("toto");
	}

	@SubscribeMessage('ball')
	async moveBall(allPos) {
		if (allPos.ballX === allPos.width) {
			// console.log(allPos.ballX + " et " + allPos.width);
			allPos.ballX = 0;
		}
		allPos.ballX++;
		this.server.emit("updatedBall", allPos.ballX);

	}

	@SubscribeMessage('notification')
	async test() {
		console.log("tata");
	}
}
