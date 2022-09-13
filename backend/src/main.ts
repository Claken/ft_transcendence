import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACK_PORT;
  app.use(
    session({
      cookie: {
        maxAge: 86400000 //60000 * 60 * 24
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  if (passport !== undefined)
  {
    app.use(passport.initialize());
    app.use(passport.session());
  }
  await app.listen(port);
}
bootstrap();
