import { NestFactory } from '@nestjs/core';
import { TypeormStore } from 'connect-typeorm/out';
import * as session from 'express-session';
import * as passport from 'passport';
import { getRepository } from 'typeorm';
// import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACK_PORT;
  // const sessionRepo = getRepository(UserSession);
  app.use(
    session({
      cookie: {
        maxAge: 86400000, //60000 * 60 * 24
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // store: new TypeormStore().connect(sessionRepo);
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(port);
}
bootstrap();
