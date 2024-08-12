import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UpdateFollowInput } from './dto/update-follow.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';
import { NotificationType } from 'src/notification/entities/notification.entity';
import { FollowType } from './entities/follow.entity';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { FollowerType } from './entities/follower.entity';
import { FolloweeType } from './entities/followee.entity';

@Resolver(() => FollowType)
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Query(() => [FollowType])
  @UseGuards(GqlAuthGuard)
  getAllNotifications(@CurrentUser() user: User) {
    return this.followService.getAllNotifications(user);
  }

  @Query(() => [FollowerType])
  @UseGuards(GqlAuthGuard)
  listFollowers(@CurrentUser() user: User) {
    return this.followService.listFollowers(user);
  }

  @Query(() => [FolloweeType])
  @UseGuards(GqlAuthGuard)
  listFollowees(@CurrentUser() user: User) {
    return this.followService.listFollowees(user);
  }

  @Mutation(() => NotificationType)
  @UseGuards(GqlAuthGuard)
  sendFollowRequest(@CurrentUser() user: User, @Args('id') id: string) {
    return this.followService.sendFollowRequest(user, id);
  }

  @Mutation(() => NotificationType)
  @UseGuards(GqlAuthGuard)
  respondToRequest(@CurrentUser() user: User, @Args('respondToRequestInput') respondToRequestInput: RespondToRequestInput) {
    return this.followService.respondToRequest(user, respondToRequestInput);
  }

  @Mutation(() => FollowType)
  removeFollow(@Args('id', { type: () => Int }) id: number) {
    return this.followService.remove(id);
  }
}
