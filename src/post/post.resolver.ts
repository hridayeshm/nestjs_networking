import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostType } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';

@Resolver(() => PostType)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [PostType])
  @UseGuards(GqlAuthGuard)
  getAllPosts(
    @CurrentUser() user: User,
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ) {
    return this.postService.getAllPosts(user, page, limit, skip);
  }

  @Query(() => PostType)
  @UseGuards(GqlAuthGuard)
  getPostByID(@CurrentUser() user: User, @Args('id') id: string) {
    return this.postService.getPostByID(user, id);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  createPost(
    @CurrentUser() user: User,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    return this.postService.createPost(user, createPostInput);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  updatePost(
    @CurrentUser() user: User,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ) {
    return this.postService.updatePost(user, updatePostInput);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  deletePost(
    @CurrentUser() user: User,
    @Args('id') id: string,
  ) {
    return this.postService.deletePost(user, id);
  }
}
