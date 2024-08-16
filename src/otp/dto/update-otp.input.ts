import { CreateOtpInput } from './create-otp.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOtpInput extends PartialType(CreateOtpInput) {
  @Field(() => Int)
  id: number;
}
