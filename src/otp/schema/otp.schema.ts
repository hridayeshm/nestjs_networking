import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Otp extends Document {
  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  userId: string;

  @Prop({
    default: () => new Date(+new Date() + 10 * 60 * 1000),
    index: { expires: '10m' },
  })
  expiresAt: Date;


  @Prop({ required: true, default: false })
  isUsed: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
