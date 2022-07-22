import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
	type: 'postgres',
	host: 'localhost',
	username: 'admin',
	password: 'pass',
	database: 'db',
	synchronize: true,
	entities: [],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
