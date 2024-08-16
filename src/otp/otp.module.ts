import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpResolver } from './otp.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schema/otp.schema';
import { OtpRepository } from './repository/otp.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [OtpResolver, OtpService, OtpRepository],
  exports: [OtpRepository]
})
export class OtpModule {}
