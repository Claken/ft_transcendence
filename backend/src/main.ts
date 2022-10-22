import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
// import { join } from 'path';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(join(__dirname, '../../frontend/src', 'chat'));
  const port = process.env.BACK_PORT;
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 360,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(port);
}
bootstrap();
