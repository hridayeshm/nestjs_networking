import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from './repository/user.repository';
import { User } from './schema/user.schema';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { NodeMailerService } from 'src/service/nodemailer.service';
import mongoose from 'mongoose';

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
