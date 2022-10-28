import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Game } from 'src/TypeOrm/Entities/game.entity';
import { GameDTO} from "../TypeOrm/DTOs/Game.dto"
import { DeleteResult, UpdateResult } from 'typeorm';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async create(@Body() post: GameDTO): Promise<GameDTO> {
    return await this.gameService.create(post);
  }

  @Get()
  async findAllGames(): Promise<Game[]> {
    return await this.gameService.findAllGames();
  }

  @Get('waitedGames')
  async getWaitedGames(): Promise<Game[]> {
    return await this.gameService.getWaitedGames();
  }

  @Get('loginLP/:loginLP')
  async getByloginLP(@Param('loginLP') loginLP: string): Promise<Game> {
    return await this.gameService.getByloginLP(loginLP);
  }

  @Get(':id')
  async getById(@Param('id') idToFind: number): Promise<Game> {
    return await this.gameService.getById(idToFind);
  }

  @Put(':id')
  async updateGameReady(
    @Param('id') id: number,
    @Body('loginRP') loginRP: string,
  ): Promise<Game> {
    return await this.gameService.updateGameReady(id, loginRP);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Game> {
    return await this.gameService.deleteGame(id);
  }
}
