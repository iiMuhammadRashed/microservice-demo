import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendEmail(payload: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void> {
    console.log('Mock email sent:', payload);
  }
}
