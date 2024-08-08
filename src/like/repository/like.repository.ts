import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../schema/like.schema';
import { LikePost } from '../interfaces/like.interface';
import { Post } from 'src/post/schema/post.schema';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async likePost(values: LikePost) {
    const like = new this.likeModel(values);
    await like.save();

    const likedPost = this.postModel.findOneAndUpdate(
      { _id: values.post },
      { $inc: { likeCount: 1 } },
    );

    return likedPost;
  }

  async unlikePost(filter) {
    this.likeModel.findOneAndDelete(filter);

    const unlikedPost = this.postModel.findOneAndUpdate(
      { _id: filter.post },
      { $inc: { likeCount: -1 } },
    );

    return unlikedPost;
  }
}
