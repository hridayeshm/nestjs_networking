import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../schema/token.schema';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly tokenModel: Model<RefreshToken>,
  ) {}

  async get(oldRefreshToken: string) {
    return this.tokenModel.findOne({ token: oldRefreshToken });
  }

  async createToken(token: string, userId: string) {
    this.tokenModel.create({
      token,
      userId,
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });
  }

  async updateToken(oldRefreshToken: string, newRefreshToken: string) {
    this.tokenModel.findOneAndUpdate(
      { token: oldRefreshToken },
      {
        token: newRefreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    );
  }

  async deleteToken(user) {
    await this.tokenModel.deleteOne({ uuid: user.uuid });
  }
}
