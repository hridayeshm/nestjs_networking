import { RegisterUserInput } from './register-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(RegisterUserInput) {
  @Field(() => Int)
  id: number;
}
