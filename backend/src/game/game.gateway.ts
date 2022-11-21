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
    this.server.emit('users', this.users);
  }

  async handleDisconnect(client) {
    //assigner un numéro dans la bdd pour l'utiliser ici
    // A client has disconnected
    // Notify connected clients of current users
    this.server.emit('users', this.users);
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
        if (infos[0].scoreLP >= infos[0].score) {
			infos[0].state = 3;
			this.server.emit('updatedData', infos[0]);
			this.server.emit("endGame", infos[0].loginLP, infos[0].loginRP, "");
			return;
		}
		else
			infos[0].ballX = infos[0].width / 2;
        infos[0].speed = 2;
      }
      // Si la balle sort du terrain de gauche
      if (left < 0) {
        infos[0].scoreRP++;
        if (infos[0].scoreRP >= infos[0].score) {
			infos[0].state = 3;
			this.server.emit('updatedData', infos[0]);
			this.server.emit("endGame", infos[0].loginRP, infos[0].loginLP, "");
			return ;
		}
		else
			infos[0].ballX = infos[0].width / 2;
        infos[0].speed = 2;
      }
      infos[0].ballX += infos[0].vx * infos[0].speed;
      infos[0].ballY += infos[0].vy * infos[0].speed;
    this.server.emit('updatedData', infos[0]);
  }

  /* ***************************************************************************** */
  /*                    Mouvement des paddles gauche et droite.                    */
  /* ***************************************************************************** */
  @SubscribeMessage('movePlayer')
  async PaddleUp(client: any, infos) {
	//TODO: En fonction de l'userID, le paddle Gauche ou Droit bouge
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
    this.server.emit('updatedPlayer', infos[0]);
    // this.server.to(client).emit('updatedPlayer', infos[0]);
  }

  /* ***************************************************************************** */
  /*                    Mise à jours du state pour les joueurs                     */
  /* ***************************************************************************** */
  @SubscribeMessage('state')
  async State(client: any, infos) {
	if (infos[0] === 5) {
		infos[2] === infos[1].loginLP ?
		this.server.emit("endGame", infos[1].loginRP, infos[1].loginLP, infos[2]) : 
		this.server.emit("endGame", infos[1].loginLP, infos[1].loginRP, infos[2]);
		return ;
	}
    this.server.emit('updatedState', infos[0]);
  }

  @SubscribeMessage('pause&play')
  async PauseAndPlay(client: any, currentState, name: string) {
    this.server.emit('PauseAndPlay', currentState, name);
  }

  /* ***************************************************************************** */
  /*                         maj des images et du compteur                         */
  /* ***************************************************************************** */
  @SubscribeMessage('image')
  async Image(client: any, infos) {
	infos[0] === infos[1].loginLP ? infos[1].mapLP = infos[2] : infos[1].mapRP = infos[2];
	if (infos[1].mapLP === infos[1].mapRP) {
		clearInterval(this.intervalID);
		this.server.emit("launchGame", infos[2])
		return;
	}
	this.server.emit('updateImg', infos);
  }

  RandomMap() {
	let map: number;
	map = Math.floor(Math.random() * 3);
	this.server.emit("launchGame", map);
  }

  tick = async (id: number) => {
	let compteur = await this.gameService.updateCompteur(id);
	if (compteur === 0) {
		clearInterval(this.intervalID);
		this.RandomMap();
	}
	else if (compteur > 0)
		this.server.emit('compteurUpdated', compteur);
}

  @SubscribeMessage('setCompteur')
  async SetCompteur(client: any, allPos) {
	let currentGame: GameDTO = await this.gameService.getCurrentGame(allPos.loginLP);
	this.intervalID = setInterval(this.tick, 1000, currentGame.id);
  }

  @SubscribeMessage('getCompteur')
  async GetCompteur(client: any, idGame: number) {
	let currentGame: GameDTO = await this.gameService.getById(idGame);
	this.server.emit("compteurUpdated", currentGame.compteur);
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
		client.emit("goPlay", currentGame);
		return ;
	}
	client.emit("changeQueue", false);
  }

  /* ***************************************************************************** */
  /*                   Rejoindre la userQueue et créer une game                    */
  /* ***************************************************************************** */

  //pour que le client join la game: client.join("game.id");
  @SubscribeMessage('joinQueue')
  async JoinQueue(client: any, user: UserDTO) {
    if (!userQueue.find((elet: UserDTO) => elet.name === user.name)) {
      userQueue.push(user);
	  await this.usersService.updateInQueue(user.id, true)
    }
    if (userQueue.length % 2 === 0) {
      /**** Take the first pending Game ****/
      const games: GameDTO[] = await this.gameService.getPendingGames();
      /**** Update Game: waitingForOppenent=false AND loginRP=user ****/
      const updatedGame: GameDTO = await this.gameService.updateGameReady(
        games[0].id,
        user.name,);
      /**** Join the socket game ****/
	//   client.join(updatedGame.id);//TODO: OK ?
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
      this.server.emit('goPlay', updatedGame); //TODO: seulement les 2 joueurs ?
    //   this.server.to(updatedGame.id).emit('goPlay', updatedGame); //TODO: OK ?
    } else {
      const newGame = await this.gameService.create({
        loginLP: user.name,
        loginRP: '',
      });
	//   client.join(newGame.id);//TODO: OK ?
    }
  }

  /* ***************************************************************************** */
  /*                             Quitter la userQueue                              */
  /* ***************************************************************************** */

  @SubscribeMessage('leaveQueue')
  async LeaveQueue(client: any, user: UserDTO) {
	let indexLP = userQueue.findIndex((elet: UserDTO) => elet.name === user.name,);
	if (indexLP !== -1) {
		const games: GameDTO[] = await this.gameService.getPendingGames();
		userQueue.splice(indexLP, 1);
		await this.usersService.updateInQueue(user.id, false)
		client.leave(games[0].id);
		await this.gameService.deleteGame(games[0].id)
  	}
  }

  /* ***************************************************************************** */
  /*                              Update user.inGame                               */
  /* ***************************************************************************** */

  @SubscribeMessage('updateInGame')
  async UpdateInGame(client: any, user: UserDTO) {
	await this.usersService.updateInGame(user.id, false);
  }

  @SubscribeMessage('endGame')
  async EndGame(client: any, infos) {
	await this.gameService.gameFinished(
		infos[0].idGame, infos[0].scoreLP, infos[0].scoreRP,
		infos[1], infos[2], infos[3]);
	if (infos[1] === infos[4].name)
		await this.usersService.OneMoreWin(infos[4].id);
	else
		await this.usersService.OneMorelose(infos[4].id);
	}
}
