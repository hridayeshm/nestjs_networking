import { Field, InputType, } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";

@InputType()
export class LoginUserInput {
    @Field(() => String)
    @IsEmail()
    email: string
    
    @Field(() => String)
    @IsString()
    password: string
}