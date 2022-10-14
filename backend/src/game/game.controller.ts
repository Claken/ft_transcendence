import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Game, IGame } from 'src/TypeOrm/Entities/game.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async create(@Body() post: IGame): Promise<IGame> {
    return await this.gameService.create(post);
  }

  @Get()
  async findAllGames(): Promise<Game[]> {
    return await this.gameService.findAllGames();
  }

  // @Get(':id')
  // async findLoginLP(@Param('id') idToFind: number): Promise<string> {
  //   return await this.gameService.getLoginLPById(id);
  // }
  @Get(':id')
  async getById(@Param('id') idToFind: number): Promise<Game> {
    return await this.gameService.getById(idToFind);
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: IGame,
  ): Promise<UpdateResult> {
    return await this.gameService.updateGame(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.gameService.deleteGame(id);
  }
}
