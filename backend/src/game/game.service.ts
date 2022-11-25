import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/TypeOrm/Entities/game.entity';
import { GameDTO } from '../TypeOrm/DTOs/Game.dto';

import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ) {}

  // save() is a "Repository" method (from Typeorm) to call insert query
  async create(game: GameDTO): Promise<Game> {
    const newGame = this.gameRepo.create(game);
    return await this.gameRepo.save(newGame);
  }

  async findAllGames(): Promise<Game[]> {
    return await this.gameRepo.find();
  }

  async getById(idToFind: number): Promise<Game> {
    return await this.gameRepo.findOneBy({
      id: idToFind,
    });
  }

  async getByloginLP(loginLP: string): Promise<Game> {
    return await this.gameRepo.findOneBy({
      loginLP: loginLP,
    });
  }

  async getCurrentGame(name: string): Promise<Game> {
    return await this.gameRepo.findOne({
		where: [
			{ loginLP: name, isFinish: false },
			{ loginRP: name, isFinish: false },
		],
	})
  }

  async getPendingGames(): Promise<Game[]> {
    return await this.gameRepo.find({
      where : {
        waitingForOppenent: true
      }
    });
  }

  async getPendingGame(name: string): Promise<Game> {
    return await this.gameRepo.findOne({
		where: [
			{loginLP: name, waitingForOppenent: true},
			{loginRP: name, waitingForOppenent: true},
		],
    });
  }

  async gameFinished(id: number, scoreLP: number, scoreRP: number,
	winner: string, loser: string, capitulator: string): Promise<Game> {
    const game = await this.getById(id);
    game.isFinish = true;
	game.winner = winner;
	game.loser = loser;
	game.scoreLP = scoreLP;
	game.scoreRP = scoreRP;
	if (capitulator)
		game.abort = capitulator;
    return await this.gameRepo.save(game);
  }

  async updateGameReady(id: number, loginRP: string): Promise<Game> {
    const game = await this.getById(id);
    game.waitingForOppenent = false;
    game.loginRP = loginRP;
    return await this.gameRepo.save(game);
  }

  async updateCompteur(id: number, end: boolean): Promise<number> {
    const game = await this.getById(id);
	if (end)
		game.compteur = 0;
	else 
		game.compteur--;
	await this.gameRepo.save(game);
	return game.compteur;
  }

  async updateMap(id: number, map: number): Promise<Game> {
    const game = await this.getById(id);
	game.map = map;
	return await this.gameRepo.save(game);
  }

  async updateState(id: number, state: number): Promise<Game> {
    const game = await this.getById(id);
	game.state = state;
	return await this.gameRepo.save(game);
  }

  async updateScore(id: number, scoreLP: number, scoreRP: number): Promise<Game> {
    const game = await this.getById(id);
	game.scoreLP = scoreLP;
	game.scoreRP = scoreRP;
	return await this.gameRepo.save(game);
  }

  async deleteGame(id: number): Promise<Game> {
    const game = await this.getById(id);
    return await this.gameRepo.remove(game);
  }

    // @Cron(CronExpression.EVERY_30_MINUTES)
    async removePendingGames(): Promise<Game[]> {
      const pendingGames = await this.getPendingGames();
      return await this.gameRepo.remove(pendingGames);
    }
}
