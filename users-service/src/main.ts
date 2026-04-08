import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersAppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.USERS_HTTP_PORT || 3001);
  await app.listen(port);
  console.log(`Users Service HTTP running on port ${port}`);
}

bootstrap();
