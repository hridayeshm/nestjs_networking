import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';
import { User } from 'src/user/schema/user.schema';
import { CreateCommentWithAuthorInfo } from '../dto/create-comment.input';
import { Comment } from '../schema/comment.schema';
import { UpdateCommentInput } from '../dto/update-comment.input';

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
    return this.commentModel.find({ post: id });
  }

  async updateComment(user: User, updateCommentInput: UpdateCommentInput) {
    return this.commentModel.findOneAndUpdate(
      { _id: updateCommentInput.post, author: user.id },
      {
        $set: {
          content: updateCommentInput.content,
        },
      },
      { new: true },
    );
  }

  async deleteComment(user: User, id: string) {
    const deletedComment = await this.commentModel.findOneAndDelete({
      _id: id,
      author: user.id,
    });

    console.log(deletedComment)
    const uncommentedPost = this.postModel.findOneAndUpdate(
      { _id: deletedComment.post },
      { $inc: { commentCount: -1 } },
    );

    return uncommentedPost;
  }

  async deleteCommentByPostOwner(
    user: User,
    postID: string,
    commentID: string,
  ) {
    const post = this.postModel.findOne({ _id: postID, owner: user.id });

    if (!post) {
      throw new Error(
        'post not found or you are authorized to delete this comment',
      );
    }

    const deletedComment = await this.commentModel.findOneAndDelete({
      _id: commentID,
    });

    if (!deletedComment) {
      throw new Error('comment not found or could not be deleted');
    }

    const uncommentedPost = this.postModel.findOneAndUpdate(
      { _id: deletedComment.post },
      { $inc: { commentCount: -1 } },
    );

    return uncommentedPost;
  }
}
