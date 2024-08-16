import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UserType } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';
import * as bcrypt from 'bcrypt';
import {
  RegisterUserInput,
  RegisterUserWithUUID,
} from '../dto/register-user.input';
import { Post } from 'src/post/schema/post.schema';
import { ChangePasswordInput } from '../../auth/dto/change-password.input';
import { TokenRepository } from 'src/token/repository/token.repository';
import { JwtPayloadUser } from 'src/token/interfaces/jwt-payload.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async registerUser(registerUserInput: RegisterUserInput): Promise<User> {
    const registeredUser = new this.userModel(registerUserInput);
    await registeredUser.save();
    return registeredUser;
  }

  async verifyUser(userId: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        mailVerifiedAt: new Date(),
        status: UserStatus.Active,
      },
    );
  }

  async verifyEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async verifyPassword(
    inputPassword: string,
    dbPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(inputPassword, dbPassword);
  }

  async verifyUserStatus(status: UserStatus) {
    if (status === UserStatus.Inactive || status === UserStatus.Blocked) {
      return false;
    }
    return true;
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id });
  }

  async showFeed(user: User) {
    const foundUser = await this.userModel
      .findOne({ _id: user.id })
      .populate('followees', 'id');

    return this.postModel.find({ 'owner.id': { $in: foundUser.followees } });
  }

  async changePassword(user: User, newPassword: string) {
    const foundUser = await this.userModel.findOne({ _id: user.id });
    if (!this.verifyPassword) {
      throw new BadRequestException('Incorrect current password');
    }
    foundUser.password = newPassword; 
    return await foundUser.save();
  }
}
