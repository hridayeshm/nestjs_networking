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

  @Query(() => PostType, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postService.createPost(createPostInput, user);
  }

  @Mutation(() => PostType)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => PostType)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }
}
