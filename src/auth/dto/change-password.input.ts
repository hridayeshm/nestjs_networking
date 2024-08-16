import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, MinLength } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsString()
  currentPassword: string;

  @Field(() => String)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Match('password', { message: 'Passwords do not match' })
  newPassword: string;

  @Field(() => Boolean)
  @IsBoolean()
  logoutFromAllDevices: boolean
}
