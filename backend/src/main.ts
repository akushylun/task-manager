import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task manager')
    .setDescription('Task manager API description')
    .setVersion('1.0')
    .addTag('tasks')
    .addTag('auth')
    .addCookieAuth('connect.sid')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  const redisClient = createClient({
    url: config.getOrThrow<string>('REDIS_URL'),
  });
  redisClient.on('error', (err) => console.error('Redis error', err));
  await redisClient.connect();

  SwaggerModule.setup('api', app, documentFactory);

  app.use(
    session({
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
        // A `Secure` cookie is only sent over HTTPS — and express-session
        // silently drops the Set-Cookie entirely on a plain-HTTP connection.
        // "Secure" is about the transport (HTTPS), NOT about NODE_ENV, so it
        // gets its own switch: false for local HTTP (docker compose), true
        // only once TLS terminates in front of the app. Behind a TLS-
        // terminating proxy you also need app.set('trust proxy', 1).
        secure: config.get<string>('COOKIE_SECURE') === 'true',
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  // Lets Nest run its shutdown handlers on SIGTERM/SIGINT, which is what tells
  // the BullMQ worker to stop taking new jobs and finish the one it is running.
  // Without it a job killed mid-run sits in 'active' until its lock expires.
  app.enableShutdownHooks();

  await app.listen(config.get<string>('PORT') ?? 3000);
}
bootstrap();
