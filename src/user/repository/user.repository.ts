import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UserType } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';
import * as bcrypt from 'bcrypt';
import { RegisterUserWithUUID } from '../dto/register-user.input';
import { Post } from 'src/post/schema/post.schema';
import { ChangePasswordInput } from '../dto/change-password.input';
import { TokenRepository } from 'src/token/repository/token.repository';
import { JwtPayloadUser } from 'src/token/interfaces/jwt-payload.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async registerUser(
    registerUserWithUUID: RegisterUserWithUUID,
  ): Promise<User> {
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

  async changePassword(user: User, changePasswordInput: ChangePasswordInput) {
    const foundUser = await this.userModel.findOne({ _id: user.id });
    if (!this.verifyPassword) {
      throw new BadRequestException('Incorrect current password');
    }
    foundUser.password = changePasswordInput.newPassword;
    await foundUser.save();
    console.log(user);
    return foundUser;
  }

  async logoutUser(user: JwtPayloadUser) {
    //khas ma refresh token pathaune logout garda
    this.tokenRepository.deleteToken(user); // token deletion not working

    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        status: UserStatus.Inactive,
      },
      {
        new: true,
      },
    );
  }
}
