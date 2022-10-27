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

  // async getLoginLPById(idToFind: number): Promise<string> {
  //   const game = await this.gameRepo.findOneBy({
  //     id: idToFind,
  //   });
  //   return game.loginLP;
  // }

  async updateGame(id: number, game: GameDTO): Promise<UpdateResult> {
    return await this.gameRepo.update(id, game);
  }

  async deleteGame(id: number): Promise<DeleteResult> {
    return await this.gameRepo.delete(id);
  }
}
