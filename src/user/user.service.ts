import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from './repository/user.repository';
import { User } from './schema/user.schema';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { NodeMailerService } from 'src/service/nodemailer.service';
import mongoose from 'mongoose';
import { ChangePasswordInput } from './dto/change-password.input';
import { JwtPayloadUser } from 'src/token/interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(registerUserInput: RegisterUserInput): Promise<User> {
    const registerUserWithUUID = {
      ...registerUserInput,
      emailVerificationToken: uuidv4(),
    };
    const registeredUser: User =
      await this.userRepository.registerUser(registerUserWithUUID);
    const nodeMailerService = new NodeMailerService();
    nodeMailerService.sendVerficationMail(registeredUser);
    return registeredUser;
  }

  async showFeed(user: User) {
    return this.userRepository.showFeed(user);
  }

  async changePassword(user: User, changePasswordInput: ChangePasswordInput) {
    return this.userRepository.changePassword(user, changePasswordInput)
  }

  async logoutUser(user: JwtPayloadUser) {
    return this.userRepository.logoutUser(user);
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
