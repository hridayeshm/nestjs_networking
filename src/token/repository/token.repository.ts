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

  async find(decoded_refresh_token) {
    return this.tokenModel.findOne({ uuid: decoded_refresh_token.uuid });
  }

  async createToken(jwt_refresh_payload) {
    this.tokenModel.create({
      uuid: jwt_refresh_payload.uuid,
      userId: jwt_refresh_payload.sub,
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });
  }

  async updateToken(decoded_refresh_token, jwt_refresh_payload) {
    this.tokenModel.findOneAndUpdate(
      { uuid: decoded_refresh_token.uuid },
      {
        uuid: decoded_refresh_token.uuid,
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    );
  }

  async deleteUserAllTokens(userId: string) {
    this.tokenModel.deleteMany({userId});
  }

  async deleteOne(uuid: string) {
    this.tokenModel.findOneAndDelete({uuid});
  }
}
