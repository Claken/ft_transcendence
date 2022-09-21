import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACK_PORT;
<<<<<<< HEAD
=======
  app.use(cookieParser());
>>>>>>> 926b18a226edc599adadd1a0e37ed4c40b571230
  await app.listen(port);
}
bootstrap();
