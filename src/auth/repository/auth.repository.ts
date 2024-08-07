import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { User } from 'src/user/schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}




}
