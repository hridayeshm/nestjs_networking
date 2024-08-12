import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RespondToRequestInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field()
  action: string;
}
