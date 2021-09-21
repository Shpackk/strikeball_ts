import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port:587,
        secure: false,
        auth: {
          user: 'victorijja45@gmail.com',
          pass: 'Gfifhtctyxer11',
        },
      },
      defaults: {
        from: 'StrikeBall Service',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}