import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';
import { User } from 'src/user/schema/user.schema';
import { CreateCommentWithAuthorInfo } from '../dto/create-comment.input';
import { Comment } from '../schema/comment.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createComment(user: User, values: CreateCommentWithAuthorInfo) {
    const comment = new this.commentModel(values);
    await comment.save();

    const commentedPost = this.postModel.findOneAndUpdate(
      { _id: comment.post },
      {
        $push: {
          latesComments: {
            $each: [
              {
                content: comment.content,
                commentedBy: {
                  id: comment.author,
                  username: user.username,
                },
              },
            ],
            $position: 0,
            $slice: 2,
          },
        },
        $inc: { commentCount: 1 },
      },
      { new: true },
    );

    return commentedPost;
  }

  async getAllComments(id: string) {
    return this.commentModel.find({post: id});
  }
}
