import { Module } from '@nestjs/common';
import { EmailHandler } from './email.handler';
import { EmailService } from './email.service';

@Module({
  controllers: [EmailHandler],
  providers: [EmailService],
})
export class EmailAppModule {}
