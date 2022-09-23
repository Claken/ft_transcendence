import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACK_PORT;
  // const reflector = new Reflector();
  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(port);
}
bootstrap();
