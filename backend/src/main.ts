import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACK_PORT;
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
