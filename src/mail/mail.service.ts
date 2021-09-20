import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserConfirmation(email, subject, text) {
    await this.mailerService.sendMail({
        from:'StrikBall Team',
        to: email,
        subject,
        text
    });
  }
}