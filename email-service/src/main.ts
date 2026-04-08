import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EmailAppModule } from './email-app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EmailAppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'emails_queue',
        queueOptions: { durable: true },
        noAck: false,
      },
    },
  );

  await app.listen();
  console.log('Email Service listening on emails_queue');
}

bootstrap();
