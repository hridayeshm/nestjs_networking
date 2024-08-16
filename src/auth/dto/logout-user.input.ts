import { Field, InputType, } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

@InputType()
export class LogoutUserInput {
    @Field(() => String)
    @IsString()
    refreshToken: string
    
    @Field(() => Boolean)
    @IsBoolean()
    logoutFromAllDevices: boolean
}