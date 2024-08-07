import { Field, InputType, } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";

@InputType()
export class RegisterUserInput {
    @Field(() => String)
    @IsString()
    username: string

    @Field(() => String)
    @IsEmail()
    email: string
    
    @Field(() => String)
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string
}

export interface RegisterUserWithUUID extends RegisterUserInput {
    emailVerificationToken: string
}

