import { Module } from '@nestjs/common';
import { GameGateway } from "./game.gateway";
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './game.service';
import { Game } from 'src/TypeOrm/Entities/game.entity';

@Module({
  providers: [GameGateway, GameService],
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([Game])]
})
export class GameModule {}
