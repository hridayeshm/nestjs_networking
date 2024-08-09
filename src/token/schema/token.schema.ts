import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userID: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  uuid: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
