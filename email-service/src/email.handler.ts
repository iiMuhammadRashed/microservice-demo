import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MSG } from '../../shared/message-patterns';
import { EmailService } from './email.service';

@Controller()
export class EmailHandler {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern(MSG.EMAIL_SEND)
  async handleSendEmail(
    @Payload()
    data: { to: string; subject: string; text: string; html?: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.emailService.sendEmail(data);
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Error handling email event:', error);
      channel.nack(originalMsg, false, false);
    }
  }
}
