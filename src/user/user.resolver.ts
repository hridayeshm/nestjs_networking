import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User, UserDocument } from './schema/user.schema';
import { PostType } from 'src/post/entities/post.entity';
import { ChangePasswordInput } from './dto/change-password.input';
import { JwtPayloadUser } from 'src/token/interfaces/jwt-payload.interface';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    const me = this.userService.findById(user.id);

    return me;
  }

  @Query(() => [PostType])
  @UseGuards(GqlAuthGuard)
  showFeed(@CurrentUser() user: User) {
    return this.userService.showFeed(user);
  }

  @Query(() => [UserType], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  // @Query(() => UserType, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.findById(id);
  // }

  @Mutation(() => UserType)
  async registerUser(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ) {
    return this.userService.registerUser(registerUserInput);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ) {
    console.log(user)
    return this.userService.changePassword(user, changePasswordInput);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async logoutUser(@CurrentUser() user: JwtPayloadUser) {
    console.log(user)
    return this.userService.logoutUser(user);
  }
}
