import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:'.env'}),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST_MAILER,
        port:Number(process.env.MAILER_PORT),
        secure: true,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_USER_PASSWORD,
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