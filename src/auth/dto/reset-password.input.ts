import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/decorators/match.decorator";

@InputType()
export class PasswordResetInput {
  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  repeatPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  token: string;
}