import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterUserInput } from './dto/register-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User, UserDocument } from './schema/user.schema';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    const me = this.userService.findById(user.id);

    return me;
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
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => UserType)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
