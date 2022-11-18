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
import { map } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Socket } from 'dgram';
import { threadId } from 'worker_threads';

export var userQueue: UserDTO[] = [];

@WebSocketGateway({ cors: 'http://localhost:3000' })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gameService: GameService) {}

  @WebSocketServer() server;
  users: number = 0;
//   mapPlayer = {login : "", index : -1};//TODO: faire un tab en fct de gameID

  afterInit(server: any) {
    console.log('Server Initialized');
  }

  async handleConnection(client) {
    //assigner un numéro dans la bdd pour l'utiliser ici
    // A client has connected
    this.users++;
    // Notify connected clients of current users
    this.server.emit('users', this.users);
    console.log('user n°' + this.users + ' ' + client.id + ' connected');
  }

  async handleDisconnect(client) {
    //assigner un numéro dans la bdd pour l'utiliser ici
    // A client has disconnected
    // Notify connected clients of current users
    this.server.emit('users', this.users);
    console.log('user n°' + this.users + ' ' + client.id + ' disconnected');
    this.users--;
  }

  @SubscribeMessage('update')
  async moveBall(client: any, allPos) {
    /* ********************************************************************* */
    /*          var pour facilement identifier les côtés de la balle         */
    /* ********************************************************************* */
    let left = allPos.ballX,
      right = allPos.ballX + allPos.ballW,
      top = allPos.ballY,
      bot = allPos.ballY + allPos.ballH;

    /* ********************************************************************* */
    /*         Détection des colisions sur bord en Y et paddles en X         */
    /* ********************************************************************* */
    //Colisions haut et bas
    if (top - allPos.EmptyGround < 0 || bot > allPos.height) {
      allPos.vy *= -1;
    }

    //Colisions joueur Gauche
    if (allPos.ballX <= 1 + allPos.paddleW) {
      if (
        allPos.ballY + allPos.ballH >= allPos.pLY &&
        allPos.ballY <= allPos.pLY + allPos.paddleH
      ) {
        allPos.vx = 1;
        allPos.speed < 5 ? (allPos.speed += 0.2) : null;
      }
    }

    //Colisions joueur Droit
    if (allPos.ballX + allPos.ballW >= allPos.width - (1 + allPos.paddleW)) {
      if (
        allPos.ballY + allPos.ballH >= allPos.pRY &&
        allPos.ballY <= allPos.pRY + allPos.paddleH
      ) {
        allPos.vx = -1;
        allPos.speed < 5 ? (allPos.speed += 0.2) : null;
      }
    }

      // Si la balle sort du terrain de droite
      if (right > allPos.width) {
        allPos.scoreLP++;
        if (allPos.scoreLP >= allPos.score) {
			allPos.state = 3;
			this.server.emit('updatedData', allPos);
			this.server.emit("endGame", allPos.loginLP, "");
			return;
		}
		else
			allPos.ballX = allPos.width / 2;
        allPos.speed = 2;
      }
      // Si la balle sort du terrain de gauche
      if (left < 0) {
        allPos.scoreRP++;
        if (allPos.scoreRP >= allPos.score) {
			allPos.state = 3;
			this.server.emit('updatedData', allPos);
			this.server.emit("endGame", allPos.loginRP, "");
			return ;
		}
		else
			allPos.ballX = allPos.width / 2;
        allPos.speed = 2;
      }
      allPos.ballX += allPos.vx * allPos.speed;
      allPos.ballY += allPos.vy * allPos.speed;
    this.server.emit('updatedData', allPos);
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
    this.server.to(client).emit('updatedPlayer', infos[0]);
  }

  /* ***************************************************************************** */
  /*                    Mise à jours du state pour les joueurs                     */
  /* ***************************************************************************** */
  @SubscribeMessage('state')
  async State(client: any, currentState: number) {
    this.server.emit('updatedState', currentState);
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
	var toto = infos[2];
	infos[0] === infos[1].loginLP ? infos[1].mapLP = infos[2] : infos[1].mapRP = infos[2];
	if (infos[1].mapLP === infos[1].mapRP) {
		this.server.emit("launchGame", infos[2])
		return;
	}
	this.server.emit('updateImg', infos);
  }

  @SubscribeMessage('randomMap')
  async RandomMap(client: any) {
	let map: number;
	map = Math.floor(Math.random() * 3);
	this.server.emit("launchGame", map);
  }

  @SubscribeMessage('compteur')
  async UpdateCompteur(client: any, compteur: number) {
	this.server.emit('compteurUpdated', compteur);
  }

  /* ***************************************************************************** */
  /*                     Vérifie si le user est en Queue/Game                      */
  /* ***************************************************************************** */

  @SubscribeMessage('inQueueOrGame')
  async InQueueOrGame(client: any, user: UserDTO) {
	let indexUser = userQueue.findIndex((elet: UserDTO) => elet.name === user.name,);
	if (indexUser !== -1)
  		client.emit("changeQueue", true);
	//s'il n'est pas en Queue, vérifier s'il est en game
  }

  /* ***************************************************************************** */
  /*                   Rejoindre la userQueue et créer une game                    */
  /* ***************************************************************************** */

  //pour que le client join la game: client.join("game.id");
  @SubscribeMessage('joinQueue')
  async JoinQueue(client: any, user: UserDTO) {
    if (!userQueue.find((elet: UserDTO) => elet.name === user.name)) {
      console.log('Ajout du user: ' + user.name);
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
      /**** Find loginLP in UserQueue ****/
      const firstGameUserLp: UserDTO = userQueue.find(
        (elet: UserDTO) => elet.name === games[0].loginLP,
      );
      /**** Delete the 2 users in UserQueue ****/
      const indexLP = userQueue.findIndex(
        (elet: UserDTO) => elet.name === firstGameUserLp.name,
      );
      userQueue.splice(indexLP, 1);
      const indexRP = userQueue.findIndex(
        (elet: UserDTO) => elet.name === user.name,
      );
      userQueue.splice(indexRP, 1);
      /**** Redirect in the Frontend to <Game /> ****/
    //   this.server.emit('goPlay', updatedGame); //TODO: seulement les 2 joueurs ?
      this.server.to(updatedGame.id).emit('goPlay', updatedGame); //TODO: OK ?
    } else {
      const newGame = await this.gameService.create({
        loginLP: user.name,
        loginRP: '',
      });
	  client.join(newGame.id);//TODO: OK ?
    }
  }

  /* ***************************************************************************** */
  /*                             Quitter la userQueue                              */
  /* ***************************************************************************** */

  @SubscribeMessage('leaveQueue')
  async LeaveQueue(client: any, user: UserDTO) {
	let indexLP = userQueue.findIndex((elet: UserDTO) => elet.name === user.name,);
	console.log(indexLP);//TODO: retirer
	if (indexLP !== -1) {
		const games: GameDTO[] = await this.gameService.getPendingGames();
		userQueue.splice(indexLP, 1);
		client.leave(games[0].id);
		this.gameService.deleteGame(games[0].id)
  	}
  }
}
