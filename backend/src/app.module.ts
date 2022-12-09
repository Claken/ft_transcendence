import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { entities } from './TypeOrm';
import { GameModule } from './game/game.module';
import { PassportModule } from '@nestjs/passport';
import { DmModule } from './dm/dm.module';
import { FriendRequestModule } from './friendRequest/friendRequest.module';
import { BlockUserModule } from './blockUser/blockUser.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: Number.parseInt(configService.get<string>('POSTGRES_PORT')),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: entities,
          synchronize: true,
        };
      },
    }),
    PassportModule.register({
      session: true,
    }),
    UsersModule,
    AuthModule,
    GameModule,
		DmModule,
		FriendRequestModule,
		BlockUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
