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

  async getWaitedGames(): Promise<Game[]> {
    return await this.gameRepo.find({
      where : {
        waitingForOppenent: true
      }
    });
  }

  // async getLoginLPById(idToFind: number): Promise<string> {
  //   const game = await this.gameRepo.findOneBy({
  //     id: idToFind,
  //   });
  //   return game.loginLP;
  // }

  async updateGameReady(id: number, loginRP: string): Promise<Game> {
    const game = await this.getById(id);
    game.waitingForOppenent = false;
    game.loginRP = loginRP;
    return await this.gameRepo.save(game);
  }

  async deleteGame(id: number): Promise<Game> {
    const game = await this.getById(id);
    return await this.gameRepo.remove(game);
  }

    // @Cron(CronExpression.EVERY_30_MINUTES)
    async removePendingGames(): Promise<Game[]> {
      const pendingGames = await this.getWaitedGames();
      return await this.gameRepo.remove(pendingGames);
    }
}
