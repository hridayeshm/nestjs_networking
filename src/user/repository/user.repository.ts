import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UserType } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';
import * as bcrypt from 'bcrypt'
import { RegisterUserWithUUID } from '../dto/register-user.input';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async registerUser(registerUserWithUUID: RegisterUserWithUUID): Promise<User> {
    const registeredUser = new this.userModel(registerUserWithUUID);
    console.log(registeredUser);
    await registeredUser.save();
    return registeredUser;
  }

  async verifyUser(emailVerificationToken: string): Promise<User> {
    const verifiedUser = await this.userModel.findOneAndUpdate(
      { emailVerificationToken },
      {
        mailVerifiedAt: new Date(),
        emailVerificationToken: null,
        status: UserStatus.Active,
      },
      { new: true },
    );
    
    return verifiedUser;
  }

  async verifyEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async verifyPassword(
    loginPassword: string,
    dbPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(loginPassword, dbPassword);
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id});
  }

}
