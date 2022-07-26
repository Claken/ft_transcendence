import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
	  ConfigModule.forRoot({
		envFilePath: ['.env'],
	  }),
	  TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => {
		  return {
			type: 'postgres',
			host: configService.get('DB_HOST'),
			port: configService.get('DB_PORT'),
			username: configService.get('DB_USERNAME'),
			password: configService.get('DB_PASSWORD'),
			database: configService.get('DB_DATABASE'),
			autoLoadEntities: true,
			synchronize: true,
		  };
		},
	  }),
	],
	controllers: [AppController],
	providers: [AppService],
  })
export class AppModule {}