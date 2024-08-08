import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';
import { PostType } from 'src/post/entities/post.entity';

@Resolver(() => PostType)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  likePost(@CurrentUser() user: User, @Args('id') id: string) {
    return this.likeService.likePost(user, id);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  unlike(@CurrentUser() user: User, @Args('id') id: string) {
    return this.likeService.unlikePost(user, id);
  }
}
