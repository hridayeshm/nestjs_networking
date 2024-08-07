import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserStatus } from '../enums/user-status.enum';

@ObjectType()
export class UserType {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, {nullable: true})
  emailVerificationToken?: String

  @Field(() => Date ,{nullable: true})
  mailVerifiedAt?: Date

  @Field(() => UserStatus)
  status: UserStatus

  @Field(() => [ID])
  followers: string[]

  @Field(() => [ID])
  followees: string[]
}
