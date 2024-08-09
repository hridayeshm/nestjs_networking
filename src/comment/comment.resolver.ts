import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PostType } from 'src/post/entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.auth-guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/user/schema/user.schema';
import { CommentType } from './entities/comment.entity';

@Resolver(() => PostType)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  createComment(
    @CurrentUser() user: User,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.createComment(user, createCommentInput);
  }

  @Query(() => [CommentType])
  @UseGuards(GqlAuthGuard)
  getAllComments(@CurrentUser() user: User, @Args('id') id: string) {
    return this.commentService.getAllComments(id);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  updateComment(
    @CurrentUser() user: User,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentService.updateComment(user, updateCommentInput);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  deleteComment(@CurrentUser() user: User, @Args('id') id: string) {
    return this.commentService.deleteComment(user, id);
  }

  @Mutation(() => PostType)
  @UseGuards(GqlAuthGuard)
  deleteCommentByPostOwner(
    @CurrentUser() user: User,
    @Args('commentID') commentID: string,
    @Args('postID') postID: string,
  ) {
    return this.commentService.deleteCommentByPostOwner(user, postID, commentID);
  }
}
