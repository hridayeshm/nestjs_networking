import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '../schema/otp.schema';
import { User } from 'src/user/schema/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class OtpRepository {
  constructor(@InjectModel(Otp.name) private readonly otpModel: Model<Otp>) {}

  async createOtp(registeredUser: User, otp: string) {
    const otpDoc: Otp = new this.otpModel({ otp, userId: registeredUser._id });
    await otpDoc.save();

    return otpDoc;
  }

  async findOne(otp: string) {
    return await this.otpModel.findOne({ otp });
  }

  async findById(otpId: string) {
    return await this.otpModel.findById(otpId);
  }
}
