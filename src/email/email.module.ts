import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {createTransport} from 'nodemailer';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'NODEMAILER_TRANSPORTER',
      useFactory: async (configService: ConfigService) => {
        return createTransport({
          host: configService.get<string>('NODEMAILER_HOST'),
          port: parseInt(configService.get<string>('NODEMAILER_PORT'), 10),
          auth: {
            user: configService.get<string>('NODEMAILER_USER'),
            pass: configService.get<string>('NODEMAILER_PASS'),
          },
        });
      },
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: ['NODEMAILER_TRANSPORTER', EmailService],
})
export class EmailModule {}
