import { EmailPayload, EmailResponse } from './../interface/types';
import { Injectable } from '@nestjs/common';
import { MessageClient } from 'cloudmailin';

@Injectable()
export class Email {
  client: MessageClient;
  constructor() {
    this.client = new MessageClient({
      username: '02606dea731b2f94',
      apiKey: 'nqAEZHZNcBz1PxNqnZTdbCzi',
    });
  }

  async sendMessage(payload: EmailPayload): Promise<EmailResponse> {
    return await this.client.sendMessage(payload);
  }
}
