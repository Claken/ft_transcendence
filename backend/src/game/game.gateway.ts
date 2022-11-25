import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { UserDTO } from '../TypeOrm/DTOs/User.dto';
import { GameDTO } from '../TypeOrm/DTOs/Game.dto';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';
import { map } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Socket } from 'dgram';
import { threadId } from 'worker_threads';
import { Game } from 'src/TypeOrm';
import { ConsoleLogger } from '@nestjs/common';

export var userQueue: UserDTO[] = [];

@WebSocketGateway({ cors: 'http://localhost:3000' })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
	private gameService: GameService,
	private usersService: UsersService) {}

  @WebSocketServer() server;
  users: number = 0;
  intervalID = null; //TODO: créer un tab avec l'id de la game lié au intervalID

  async handleConnection(client) {
    //assigner un numéro dans la bdd pour l'utiliser ici
    // A client has connected
    this.users++;
    // Notify connected clients of current users
    client.emit('users', this.users);
  }

  async handleDisconnect(client) {
    //assigner un numéro dans la bdd pour l'utiliser ici
    // A client has disconnected
    // Notify connected clients of current users
    client.emit('users', this.users);
    this.users--;
  }

  @SubscribeMessage('update')
  async moveBall(client: any, infos) {
    /* ********************************************************************* */
    /*          var pour facilement identifier les côtés de la balle         */
    /* ********************************************************************* */
    let left = infos[0].ballX,
      right = infos[0].ballX + infos[0].ballW,
      top = infos[0].ballY,
      bot = infos[0].ballY + infos[0].ballH;

    /* ********************************************************************* */
    /*         Détection des colisions sur bord en Y et paddles en X         */
    /* ********************************************************************* */
    //Colisions haut et bas
    if (top - infos[0].EmptyGround < 0 || bot > infos[0].height) {
      infos[0].vy *= -1;
    }

    //Colisions joueur Gauche
    if (infos[0].ballX <= 1 + infos[0].paddleW) {
      if (
        infos[0].ballY + infos[0].ballH >= infos[0].pLY &&
        infos[0].ballY <= infos[0].pLY + infos[0].paddleH
      ) {
        infos[0].vx = 1;
        infos[0].speed < 5 ? (infos[0].speed += 0.2) : null;
      }
    }

    //Colisions joueur Droit
    if (infos[0].ballX + infos[0].ballW >= infos[0].width - (1 + infos[0].paddleW)) {
      if (
        infos[0].ballY + infos[0].ballH >= infos[0].pRY &&
        infos[0].ballY <= infos[0].pRY + infos[0].paddleH
      ) {
        infos[0].vx = -1;
        infos[0].speed < 5 ? (infos[0].speed += 0.2) : null;
      }
    }

      // Si la balle sort du terrain de droite
      if (right > infos[0].width) {
        infos[0].scoreLP++;
		this.gameService.updateScore(infos[0].gameId, infos[0].scoreLP, infos[0].scoreRP);
		if (infos[0].scoreLP >= infos[0].score) {
			infos[0].state = 6;
			await this.gameService.updateState(infos[0].gameId, 6);
			this.server.to(infos[0].gameId).emit('update', infos[0]);
			this.server.to(infos[0].gameId).emit("endGame", infos[0].loginLP, infos[0].loginRP, "");
			return;
		}
		else
			infos[0].ballX = infos[0].width / 2;
        infos[0].speed = 2;
      }
      // Si la balle sort du terrain de gauche
      if (left < 0) {
        infos[0].scoreRP++;
		this.gameService.updateScore(infos[0].gameId, infos[0].scoreLP, infos[0].scoreRP);
		if (infos[0].scoreRP >= infos[0].score) {
			infos[0].state = 6;
			await this.gameService.updateState(infos[0].gameId, 6);
			this.server.to(infos[0].gameId).emit('update', infos[0]);
			this.server.to(infos[0].gameId).emit("endGame", infos[0].loginRP, infos[0].loginLP, "");
			return ;
		}
		else
			infos[0].ballX = infos[0].width / 2;
        infos[0].speed = 2;
      }
      infos[0].ballX += infos[0].vx * infos[0].speed;
      infos[0].ballY += infos[0].vy * infos[0].speed;
	  this.server.to(infos[0].gameId).emit('update', infos[0]);
  }

  /* ***************************************************************************** */
  /*                    Mouvement des paddles gauche et droite.                    */
  /* ***************************************************************************** */
  @SubscribeMessage('movePlayer')
  async PaddleUp(client: any, infos) {
	if (infos[0].key === 'ArrowUp'
	|| infos[0].key === 'w'
	|| infos[0].key === 'W'
	|| infos[0].key === 'z'
	|| infos[0].key === 'Z') {
		infos[1] === infos[0].loginLP ? infos[0].pLY -= 6 : infos[0].pRY -= 6 ;
		if (infos[0].pLY < 0 + infos[0].EmptyGround)
			infos[0].pLY = 0 + infos[0].EmptyGround;
		else if (infos[0].pRY < 0 + infos[0].EmptyGround)
			infos[0].pRY = 0 + infos[0].EmptyGround;
	}
	if ( infos[0].key === 'ArrowDown'
		|| infos[0].key === 's'
		|| infos[0].key === 'S') {
		infos[1] === infos[0].loginLP ? infos[0].pLY += 6 : infos[0].pRY += 6 ;
		if (infos[0].pLY + infos[0].paddleH > infos[0].height)
			infos[0].pLY = infos[0].height - infos[0].paddleH;
		else if (infos[0].pRY + infos[0].paddleH > infos[0].height)
			infos[0].pRY = infos[0].height - infos[0].paddleH;
	}
    this.server.to(infos[0].gameId).emit('updatedPlayer', infos[0]);
  }

  /* ***************************************************************************** */
  /*                    Mise à jours et state pour les joueurs                     */
  /* ***************************************************************************** */
  @SubscribeMessage('abort')
  async Abort(client: any, infos) {
	this.gameService.updateState(infos[1].gameId, infos[1].state);
	infos[2] === infos[1].loginLP ?
	this.server.to(infos[1].gameId).emit("endGame", infos[1].loginRP, infos[1].loginLP, infos[2]) : 
	this.server.to(infos[1].gameId).emit("endGame", infos[1].loginLP, infos[1].loginRP, infos[2]);
  }

  @SubscribeMessage('pauseNplay')
  async PauseAndPlay(client: any, infos) {
	this.gameService.updateState(infos[2], infos[0]);
    this.server.to(infos[2]).emit('PauseAndPlay', infos);
  }

  @SubscribeMessage('updateData')
  async UpdateData(client: any, gameId: number) {
	let game: GameDTO = await this.gameService.getById(gameId);

	client.join(gameId);
	let newData = {
		loginRP : game.loginRP, loginLP : game.loginLP,
		scoreLP : game.scoreLP, scoreRP : game.scoreRP,
		state : game.state, map: game.map, compteur: game.compteur};
    client.emit('updateData', newData);
  }

  /* ***************************************************************************** */
  /*                         maj des images et du compteur                         */
  /* ***************************************************************************** */
  @SubscribeMessage('image')
  async Image(client: any, infos) {
	console.log("idgame dans IMAGE: "+infos[1].gameId)
	infos[0] === infos[1].loginLP ? infos[1].mapLP = infos[2] : infos[1].mapRP = infos[2];
	if (infos[1].mapLP === infos[1].mapRP) {
		clearInterval(this.intervalID);
		this.gameService.updateCompteur(infos[1].gameId, true);
		this.gameService.updateMap(infos[1].gameId, infos[1].mapLP);
		this.server.to(infos[1].gameId).emit("launchGame", infos[2])
		return;
	}
	this.server.to(infos[1].gameId).emit('updateImg', infos);
  }

  RandomMap(gameId) {
	let map: number;
	map = Math.floor(Math.random() * 3);
	this.gameService.updateMap(gameId, map);
	this.server.to(gameId).emit("launchGame", map);
  }

  tick = async (gameId: number) => {
	let compteur = await this.gameService.updateCompteur(gameId, false);
	if (compteur === 0) {
		clearInterval(this.intervalID);
		this.RandomMap(gameId);
	}
	else if (compteur > 0)
	this.server.to(gameId).emit('compteurUpdated', compteur);
}

  @SubscribeMessage('setCompteur')
  async SetCompteur(gameId) {
	this.intervalID = setInterval(this.tick, 1000, gameId);
  }

  @SubscribeMessage('getCompteur')
  async GetCompteur(client: any, gameId: number) {
	let currentGame: GameDTO = await this.gameService.getById(gameId);
	this.server.to(gameId).emit("compteurUpdated", currentGame.compteur);
  }

  /* ***************************************************************************** */
  /*                     Vérifie si le user est en Queue/Game                      */
  /* ***************************************************************************** */

  @SubscribeMessage('inQueueOrGame')
  async InQueueOrGame(client: any, user: UserDTO) {
	if (user.inQueue) {
		client.emit("changeQueue", true);
		return ;
	}
	if (user.inGame) {
		let currentGame: GameDTO = await this.gameService.getCurrentGame(user.name)
		client.join(currentGame.id);
		client.emit("goPlay", currentGame);
		return ;
	}
	client.emit("changeQueue", false);
  }

  /* ***************************************************************************** */
  /*                   Rejoindre la userQueue et créer une game                    */
  /* ***************************************************************************** */

  @SubscribeMessage('joinQueue')
  async JoinQueue(client: any, user: UserDTO) {
    if (!userQueue.find((elet: UserDTO) => elet.name === user.name)) {
		user = await this.usersService.updateInQueue(user.id, true);
		client.emit("updateUser", user);
		userQueue.push(user);
    }
    if (userQueue.length % 2 === 0) {
      /**** Take the first pending Game ****/
      const games: GameDTO[] = await this.gameService.getPendingGames();
      /**** Update Game: waitingForOppenent=false AND loginRP=user ****/
      const updatedGame: GameDTO = await this.gameService.updateGameReady(
        games[0].id,
        user.name,);
      /**** Join the socket game ****/
	  client.join(updatedGame.id);//TODO: OK ?
	  console.log("client: "+client+" has join: "+updatedGame.id);
      /**** Find loginLP in UserQueue ****/
      const firstGameUserLp: UserDTO = userQueue.find(
        (elet: UserDTO) => elet.name === games[0].loginLP,
      );
      /**** Delete the 2 users in UserQueue ****/
      const indexLP = userQueue.findIndex(
        (elet: UserDTO) => elet.name === firstGameUserLp.name,
      );
	  await this.usersService.updateInQueue(firstGameUserLp.id, false)
      userQueue.splice(indexLP, 1);
      const indexRP = userQueue.findIndex(
        (elet: UserDTO) => elet.name === user.name,
      );
	  await this.usersService.updateInQueue(user.id, false)
      userQueue.splice(indexRP, 1);
	  await this.usersService.updateInGame(firstGameUserLp.id, true)
	  await this.usersService.updateInGame(user.id, true)
      /**** Redirect in the Frontend to <Game /> ****/
	  this.server.to(updatedGame.id).emit('goPlay', updatedGame); //TODO: OK ?
	  console.log("server: "+this.server+" send to: "+updatedGame.id);
	  this.SetCompteur(updatedGame.id);
    } else {
      const newGame = await this.gameService.create({
        loginLP: user.name,
        loginRP: '',
      });
	  client.join(newGame.id);//TODO: OK ?
	  console.log("client: "+client+" has join: "+newGame.id);
		console.log("loginLP = "+newGame.loginLP);
		console.log("waiting = "+newGame.waitingForOppenent);
		// console.log("client rooms -> "+client.rooms)
		// console.log("rooms -> "+client.rooms[0])
}
  }

  /* ***************************************************************************** */
  /*                             Quitter la userQueue                              */
  /* ***************************************************************************** */

  @SubscribeMessage('leaveQueue')
  async LeaveQueue(client: any, user: UserDTO) {
	let indexLP = userQueue.findIndex((elet: UserDTO) => elet.name === user.name,);
	if (indexLP !== -1) {
		const game: GameDTO = await this.gameService.getPendingGame(user.name);
		userQueue.splice(indexLP, 1);
		user = await this.usersService.updateInQueue(user.id, false);
		client.leave(game.id);
		client.emit("updateUser", user);
		await this.gameService.deleteGame(game.id);
  	}
  }

  /* ***************************************************************************** */
  /*                              Update user.inGame                               */
  /* ***************************************************************************** */

  @SubscribeMessage('updateInGame')
  async UpdateInGame(client: any, user: UserDTO, gameId: number) {
	user = await this.usersService.updateInGame(user.id, false);
	client.emit("updateUser", user);
	client.leave(gameId);
	}

  @SubscribeMessage('endGame')
  async EndGame(client: any, infos) {
	await this.gameService.gameFinished(
		infos[0].gameId, infos[0].scoreLP, infos[0].scoreRP,
		infos[1], infos[2], infos[3]);
	if (infos[1] === infos[4].name)
		await this.usersService.OneMoreWin(infos[4].id);
	else
		await this.usersService.OneMorelose(infos[4].id);
	}
}
