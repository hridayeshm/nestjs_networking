import { Injectable } from '@nestjs/common';
import { CreateOtpInput } from './dto/create-otp.input';
import { UpdateOtpInput } from './dto/update-otp.input';

@Injectable()
export class OtpService {
  create(createOtpInput: CreateOtpInput) {
    return 'This action adds a new otp';
  }

  findAll() {
    return `This action returns all otp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otp`;
  }

  update(id: number, updateOtpInput: UpdateOtpInput) {
    return `This action updates a #${id} otp`;
  }

  remove(id: number) {
    return `This action removes a #${id} otp`;
  }
}
