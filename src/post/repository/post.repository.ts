import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schema/post.schema';
import { CreatePostWithOwnerInfo } from '../dto/create-post.input';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(values: CreatePostWithOwnerInfo) {
    const post = new this.postModel(values);
    await post.save();

    return post;
  }

  async getAllPosts(filter, options) {
    return this.postModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "owner.id",
          foreignField: "_id",
          as: "postCreator",
        },
      },

      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },

      {
        $project: {
          title: 1,
          description: 1,

          likeCount: 1,

          "postCreator.username": 1,
          "postCreator._id": 1,

          "likes.author": 1,
          latestComments: 1, 
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      { $skip: (options.page - 1) * options.limit },
      { $limit: options.limit },
    ]);
  }
}
