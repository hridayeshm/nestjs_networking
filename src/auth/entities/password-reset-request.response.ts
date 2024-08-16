import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PasswordResetRequestResponse {
  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  userId?: string;
}