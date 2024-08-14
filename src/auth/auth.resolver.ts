import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { UpdateAuthInput } from './dto/update-auth.input';
import { UserType } from 'src/user/entities/user.entity';
import { LoginUserInput } from 'src/user/dto/login-user.input';
import { LoginResponse } from './entities/login-response.entity';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserType)
  verifyUser(@Args('emailVerificationToken') emailVerificationToken: string) {
    return this.authService.verifyUser(emailVerificationToken);
  }

  @Mutation(() => LoginResponse)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => LoginResponse)
  generateNewAccessToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.generateNewAccessToken(refreshToken)
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
