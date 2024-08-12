import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../schema/token.schema';
import { User } from 'src/user/schema/user.schema';
import { JwtPayloadUser } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokenRepository {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async createToken(user: User, uuid: string) {
    const tokenDoc = new this.tokenModel({userID: user.id, email: user.email, uuid});
    await tokenDoc.save()
  }

  async deleteToken(user) {
    await this.tokenModel.deleteOne({ uuid: user.uuid});
  }
}
