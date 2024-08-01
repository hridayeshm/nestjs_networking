import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../interfaces/user.interface';
import { UserStatus } from '../enums/user-status.enum';
import {Document} from 'mongoose';
import mongoose from 'mongoose';
import { Field } from '@nestjs/graphql';


export type UserDocument = User & Document

@Schema({timestamps: true})
export class User extends Document {


  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, unique: true})
  password: string

  @Prop({ type: String})
  emailVerificationToken?: string

  @Prop({ type: Date})
  mailVerifiedAt?: Date

  @Prop({ type: String, enum: UserStatus, default: UserStatus.Inactive })
  status: UserStatus

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers: string[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}] })
  followees: string[]
}

export const UserSchema = SchemaFactory.createForClass(User);
