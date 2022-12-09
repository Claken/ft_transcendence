import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UserDTO } from '../TypeOrm/DTOs/User.dto';
import { GameDTO } from '../TypeOrm/DTOs/Game.dto';
import { GameService } from './game.service';
import { UsersService } from 'src/users/users.service';

export var userQueue: UserDTO[] = [];
export interface ObjInterval {
	gameId:		number,
	intervalID:	NodeJS.Timer,
}
// export var tabIntervalId: ObjInterval[] = [];

@WebSocketGateway({ cors: 'http://localhost:3000' })
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
	private readonly gameService: GameService,
	private readonly usersService: UsersService) {}

  @WebSocketServer() server;
  users: number = 0;
  tabIntervalId: ObjInterval[] = [];

  async handleConnection(client) {
    // A client has connected
    this.users++;
}

  async handleDisconnect(client) {
    // A client has disconnected
    this.users--;
	//wait 1sec then check if the user is disconnect
	setTimeout(() => {
		this.isDisconnect(client.id);
	}, 1500)
  }

  async isDisconnect(client: string) {
	let user: UserDTO = await this.usersService.getByClient(client);
	if (user) {
		if (user.inQueue) {
			const indexUser = userQueue.findIndex(
				(elet: UserDTO) => elet.name === user.name);
			await this.usersService.updateInQueue(user.id, false)
			userQueue.splice(indexUser, 1);
		}
		if (user.inGame) {
			if (user.login)
				var game: GameDTO = await this.gameService.getCurrentGame(user.login);
			else 
				var game: GameDTO = await this.gameService.getCurrentGame(user.name);

			await this.gameService.updateState(game.id, 6);
			await this.usersService.updateInGame(user.id, false);
			this.server.to(game.id).emit("opponentLeave", user.name);
		}
	}
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
			this.server.to(infos[0].gameId).emit("endGame", infos[0].nameLP);
			this.EndGameB(client, infos[0], infos[0].nameLP, infos[0].nameRP, "");
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
			this.server.to(infos[0].gameId).emit("endGame", infos[0].nameRP);
			this.EndGameB(client, infos[0], infos[0].nameRP, infos[0].nameLP, "");
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
		infos[1] === infos[0].nameLP ? infos[0].pLY -= 6 : infos[0].pRY -= 6 ;
		if (infos[0].pLY < 0 + infos[0].EmptyGround)
			infos[0].pLY = 0 + infos[0].EmptyGround;
		else if (infos[0].pRY < 0 + infos[0].EmptyGround)
			infos[0].pRY = 0 + infos[0].EmptyGround;
	}
	if ( infos[0].key === 'ArrowDown'
		|| infos[0].key === 's'
		|| infos[0].key === 'S') {
		infos[1] === infos[0].nameLP ? infos[0].pLY += 6 : infos[0].pRY += 6 ;
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
	this.gameService.updateState(infos[0].gameId, infos[0].state);
	if (infos[1] === infos[0].nameLP) {
		await this.gameService.updateState(infos[0].gameId, 6);
		this.server.to(infos[0].gameId).emit("endGame", infos[0].nameRP);
		this.EndGameB(client, infos[0], infos[0].nameRP, infos[0].nameLP, infos[0].nameLP);
	}
	else {
		await this.gameService.updateState(infos[0].gameId, 6);
		this.server.to(infos[0].gameId).emit("endGame", infos[0].nameLP);
		this.EndGameB(client, infos[0], infos[0].nameLP, infos[0].nameRP, infos[0].nameRP);
	}
  }

  @SubscribeMessage('pauseNplay')
  async PauseAndPlay(client: any, infos) {
	this.gameService.updateState(infos[2], infos[0]);
    this.server.to(infos[2]).emit('PauseAndPlay', infos);
  }

  @SubscribeMessage('updateData')
  async UpdateData(client: any, gameId: number) {
	let game: GameDTO = await this.gameService.getById(gameId);
	let userLeft: UserDTO = await this.usersService.getByName(game.nameLP);
	let userRight: UserDTO = await this.usersService.getByName(game.nameRP);

	client.join(gameId);
	let newData = {
		nameRP : game.nameRP, nameLP : game.nameLP,
		scoreLP : game.scoreLP, scoreRP : game.scoreRP,
		state : game.state, map: game.map, compteur: game.compteur,
		WLuserL : [userLeft.win, userLeft.lose], WLuserR : [userRight.win, userRight.lose]};
    client.emit('updateData', newData);
  }

  /* ***************************************************************************** */
  /*                         maj des images et du compteur                         */
  /* ***************************************************************************** */
  @SubscribeMessage('image')
  async Image(client: any, infos) {
	let game: GameDTO = await this.gameService.getById(infos[1].gameId);

	infos[0] === infos[1].nameLP ? infos[1].mapLP = infos[2] : infos[1].mapRP = infos[2];
	if (infos[1].mapLP === infos[1].mapRP) {
		this.deleteInter(game.id);
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

  tick = async (gameId: number, nbInter: number) => {
	const compteur: number = await this.gameService.updateCompteur(gameId, false);
	const nbInterval = await this.gameService.getNbInter(gameId);

	if (nbInterval !== nbInter)
		this.deleteInter(gameId);
	if (compteur === 0) {
		this.deleteInter(gameId);
		this.RandomMap(gameId);
	}
	else if (compteur > 0)
		this.server.to(gameId).emit('compteurUpdated', compteur);
  }

  deleteInter = async (id: number) => {
	const res = this.tabIntervalId.filter((objInterval: ObjInterval) => objInterval.gameId === id);
	const index = this.tabIntervalId.findIndex((objInterval: ObjInterval) => objInterval.gameId === id);
	if (res[0]) {
		clearInterval(res[0].intervalID);
		if (index !== -1)
			this.tabIntervalId.splice(index, 1);
	}
  }

  @SubscribeMessage('setCompteur')
  async SetCompteur(client: any, gameId: number) {
	let nbInter = await this.gameService.updateNbInterval(gameId);
	const interval = setInterval(this.tick, 1000, gameId, nbInter);
	this.tabIntervalId.push({gameId, intervalID: interval});
}

  /* ***************************************************************************** */
  /*                     Vérifie si le user est en Queue/Game                      */
  /* ***************************************************************************** */

  @SubscribeMessage('inQueueOrGame')
  async InQueueOrGame(client: any, user: UserDTO) {
	if (user && user.inQueue) {
		if (user.login)
			var waitingGame: GameDTO = await this.gameService.getPendingGame(user.login);
		else 
			var waitingGame: GameDTO = await this.gameService.getPendingGame(user.name);
		if (waitingGame) {
			client.join(waitingGame.id);
			client.emit("changeQueue", true);
		}
		return ;
	}
	if (user && user.inGame) {
		if (user.login)
				var currentGame: GameDTO = await this.gameService.getCurrentGame(user.login);
			else 
				var currentGame: GameDTO = await this.gameService.getCurrentGame(user.name);
		if (currentGame)
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
	  if (user.login) {
		var updatedGame: GameDTO = await this.gameService.updateGameReady(
		games[0].id,
		user.login, user.name);
	  }
	  else {
		var updatedGame: GameDTO = await this.gameService.updateGameReady(
		games[0].id,
		user.name, user.name);
	  }
      /**** Join the socket game ****/
	  client.join(updatedGame.id);
      /**** Find loginLP in UserQueue ****/
      let firstGameUserLp: UserDTO = userQueue.find(
        (elet: UserDTO) => elet.name === games[0].nameLP,
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
	  firstGameUserLp = await this.usersService.updateInGame(firstGameUserLp.id, true)
	  user = await this.usersService.updateInGame(user.id, true)
	  this.server.to(updatedGame.id).emit("updateUsers", firstGameUserLp, user);
      /**** Redirect in the Frontend to <Game /> ****/
	  this.server.to(updatedGame.id).emit('goPlay', updatedGame);
	  this.SetCompteur(client, updatedGame.id);
    }
	else {
	  let login: string;
	  if (!user.login)
		login = user.name;
	  else
		login = user.login;
      const newGame = await this.gameService.create({
        loginLP: login,
		nameLP: user.name,
        loginRP: '',
		nameRP: '',
      });
	  client.join(newGame.id);
	}
  }

  /* ***************************************************************************** */
  /*                             Quitter la userQueue                              */
  /* ***************************************************************************** */

  @SubscribeMessage('leaveQueue')
  async LeaveQueue(client: any, user: UserDTO) {
	let indexLP = userQueue.findIndex((elet: UserDTO) => elet.name === user.name,);
	if (indexLP !== -1) {
		if (user.login)
			var game: GameDTO = await this.gameService.getPendingGame(user.login);
		else 
			var game: GameDTO = await this.gameService.getPendingGame(user.name);
		userQueue.splice(indexLP, 1);
		user = await this.usersService.updateInQueue(user.id, false);
		client.leave(game.id);
		client.emit("updateUser", user);
		await this.gameService.deleteGame(game.id);
  	}
  }

  /* ***************************************************************************** */
  /*                               MAJ du/Des users                                */
  /* ***************************************************************************** */

  @SubscribeMessage('user')
  async User(client: any, userId: number) {
	const user = await this.usersService.updateSocket(userId, client.id);
	user.lastSocket = client.id;
	if (user.inQueue === true) {
		client.emit("redirect", "");
	}
	if (user.inGame === true) {
		if (user.login)
				var game: GameDTO = await this.gameService.getCurrentGame(user.login);
			else 
				var game: GameDTO = await this.gameService.getCurrentGame(user.name);
		if (game)
			client.emit("redirect", game.id);
	}
  }

  @SubscribeMessage('updateInGame')
  async UpdateInGame(client: any, user: UserDTO, gameId: number) {
	user = await this.usersService.updateInGame(user.id, false);
	client.emit("updateUser", user);
	client.leave(gameId);
  }

  @SubscribeMessage('leaveSocket')
  async LeaveSocket(client: any, gameId: number) {
	client.leave(gameId);
  }

  /* ***************************************************************************** */
  /*                                FIN de partie                                  */
  /* ***************************************************************************** */

  @SubscribeMessage('endGameB')
  async EndGameB(client: any, allPos, winner: string, loser: string, capitulator: string) {
	let game: GameDTO = await this.gameService.getCurrentGame(allPos.loginLP);

	if (game) {
		let userLeft: UserDTO = await this.usersService.getByName(game.nameLP);
		let userRight: UserDTO = await this.usersService.getByName(game.nameRP);
		if (client.id === userLeft.lastSocket)
			this.UpdateInGame(client, userLeft, allPos.gameId);
		else
			this.UpdateInGame(client, userRight, allPos.gameId);
		if (game.isFinish === false && userLeft && userRight) {
			game = await this.gameService.gameFinished(
				allPos.gameId, allPos.scoreLP, allPos.scoreRP,
				winner, loser, capitulator);
			if (userLeft.name === winner) {
				await this.usersService.userWin(userLeft.id, allPos.WinLoseL[0]);
				await this.usersService.userLose(userRight.id, allPos.WinLoseR[1]);
			}
			else {
				await this.usersService.userLose(userLeft.id, allPos.WinLoseL[1]);
				await this.usersService.userWin(userRight.id, allPos.WinLoseR[0]);
			}
		}
	}
  }

  @SubscribeMessage('endGameF')
  async EndGameF(client: any, infos) {
	let game: GameDTO = await this.gameService.getCurrentGame(infos[0].nameLP);

	if (game) {
		let userLeft: UserDTO = await this.usersService.getByName(game.nameLP);
		let userRight: UserDTO = await this.usersService.getByName(game.nameRP);
		if (client.id === userLeft.lastSocket)
			this.UpdateInGame(client, userLeft, infos[0].gameId);
		else
			this.UpdateInGame(client, userRight, infos[0].gameId);
		if (game.isFinish === false && userLeft && userRight) {
			game = await this.gameService.gameFinished(
				infos[0].gameId, infos[0].scoreLP, infos[0].scoreRP,
				infos[1], infos[2], infos[3]);
			if (userLeft.name === infos[1]) {
				await this.usersService.userWin(userLeft.id, infos[0].WinLoseL[0]);
				await this.usersService.userLose(userRight.id, infos[0].WinLoseR[1]);
			}
			else {
				await this.usersService.userLose(userLeft.id, infos[0].WinLoseL[1]);
				await this.usersService.userWin(userRight.id, infos[0].WinLoseR[0]);
			}
		}
	}
  }

  /* ***************************************************************************** */
  /*                             affichage des game                                */
  /* ***************************************************************************** */

  @SubscribeMessage('getCurrGames')
  async GetCurrGames(client: any, gameId: number) {
  }
}
