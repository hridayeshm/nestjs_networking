import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { UpdateAuthInput } from './dto/update-auth.input';
import { UserType } from 'src/user/entities/user.entity';
import { LoginResponse } from './entities/login-response.entity';
import { VerifyOtpResponse } from './entities/verifyOtp-response.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';
import { LogoutUserInput } from './dto/logout-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { LogoutResponse } from './entities/logout-response.entity';
import { ChangePasswordType } from 'src/auth/entities/change-password.entity';
import { ChangePasswordInput } from './dto/change-password.input';  

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => VerifyOtpResponse)
  verifyOtp(@Args('otp') otp: string) {
    return this.authService.verifyOtp(otp);
  }

  @Mutation(() => LoginResponse)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => LoginResponse)
  generateNewAccessToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.generateNewAccessToken(refreshToken);
  }

  @Mutation(() => VerifyOtpResponse)
  resendOtp(@Args('userId') userId: string) {
    return this.authService.resendOtp(userId);
  }

  @Mutation(() => ChangePasswordType)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ) {
    console.log(user)
    return this.authService.changePassword(user, changePasswordInput);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(GqlAuthGuard)
  async logout(
    @CurrentUser() user: User,
    @Args('logoutUserInput') logoutUserInput: LogoutUserInput,
  ) {
    return this.authService.logout(logoutUserInput);
  }

  @Query(() => UserType)
  @Query(() => UserType)
  lo(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
