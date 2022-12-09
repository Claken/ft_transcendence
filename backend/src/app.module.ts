import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppLoggerMiddleware } from './http.logger.middleware';
import { MiddlewareConsumer } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { entities } from './TypeOrm';
import { GameModule } from './game/game.module';
import { PassportModule } from '@nestjs/passport';
import { DmModule } from './dm/dm.module';
import { AvatarModule } from './avatar/avatar.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FriendRequestModule } from './friendRequest/friendRequest.module';
import { BlockUserModule } from './blockUser/blockUser.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, EventEmitterModule.forRoot()],
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
    ChatModule,
    GameModule,
		DmModule,
		AvatarModule,
		FriendRequestModule,
		BlockUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
