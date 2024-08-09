import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { Follow } from './entities/follow.entity';
import { UpdateFollowInput } from './dto/update-follow.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';
import { Notification } from 'src/notification/entities/notification.entity';

@Resolver(() => Follow)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Mutation(() => Notification)
  @UseGuards(GqlAuthGuard)
  sendFollowRequest(@CurrentUser() user: User, @Args('id') id: string) {
    return this.followService.sendFollowRequest(user, id);
  }

  @Query(() => [Follow])
  @UseGuards(GqlAuthGuard)
  getAllNotifications(@CurrentUser() user: User) {
    return this.followService.getAllNotifications(user);
  }

  @Query(() => Follow, { name: 'follow' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.followService.findOne(id);
  }

  @Mutation(() => Follow)
  updateFollow(
    @Args('updateFollowInput') updateFollowInput: UpdateFollowInput,
  ) {
    return this.followService.update(updateFollowInput.id, updateFollowInput);
  }

  @Mutation(() => Follow)
  removeFollow(@Args('id', { type: () => Int }) id: number) {
    return this.followService.remove(id);
  }
}
