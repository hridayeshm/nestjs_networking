import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './schema/user.schema';
import { UpdateUserInput } from './dto/update-user.input';
import { RegisterUserInput } from './dto/register-user.input';
import { NodeMailerService } from 'src/service/nodemailer.service';
import { ChangePasswordInput } from '../auth/dto/change-password.input';
import { OtpRepository } from 'src/otp/repository/otp.repository';
import { Otp } from 'src/otp/schema/otp.schema';
import { TokenRepository } from 'src/token/repository/token.repository';
import { generateOtp } from 'src/utils/generate.otp';
import { Transporter } from 'nodemailer';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService
  ) {}

  async registerUser(registerUserInput: RegisterUserInput): Promise<User> {
    const registeredUser: User =
      await this.userRepository.registerUser(registerUserInput);
    const otp = generateOtp();
    const otpDoc: Otp = await this.otpRepository.createOtp(registeredUser, otp);
    this.emailService.sendMail({user: registeredUser, subject: 'User Verification Mail', token: otp})
    return registeredUser;
  }

  async showFeed(user: User) {
    return this.userRepository.showFeed(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
