import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChangePasswordType {
  @Field(() => String)
  message: string;
}
