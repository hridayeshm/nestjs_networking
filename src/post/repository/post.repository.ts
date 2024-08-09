import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schema/post.schema';
import { CreatePostWithOwnerInfo } from '../dto/create-post.input';
import { User } from 'src/user/schema/user.schema';
import { UpdatePostInput } from '../dto/update-post.input';

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
    return this.postModel.find({
      'owner.id': filter.owner.id,
      'owner.username': filter.owner.username,
    });
    // const test = await this.postModel.aggregate([
    //   { $match: filter},
    //   {
    //     $sort: {
    //       _id: 1,
    //     },
    //   },
    //   { $skip: (options.page - 1) * options.limit },
    //   { $limit: options.limit },
    // ])

    // return this.postModel.aggregate([
    //   { $match: filter },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "owner.id",
    //       foreignField: "_id",
    //       as: "postCreator",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "likes",
    //       localField: "_id",
    //       foreignField: "post",
    //       as: "likes",
    //     },
    //   },

    //   {
    //     $project: {
    //       title: 1,
    //       description: 1,

    //       likeCount: 1,

    //       "name: postCreator.username": 1,
    //       "postCreator._id": 1,

    //       "likes.author": 1,
    //       latestComments: 1,
    //     },
    //   },
    // {
    //   $sort: {
    //     _id: 1,
    //   },
    // },
    // { $skip: (options.page - 1) * options.limit },
    // { $limit: options.limit },
    // ]);
  }

  async getPostByID(filter) {
    return this.postModel.findOne({
      _id: filter.id,
      'owner.id': filter.owner.id,
      'owner.username': filter.owner.username,
    });
  }

  async updatePost(user: User, updatePostInput: UpdatePostInput) {
    return this.postModel.findOneAndUpdate(
      {
        _id: updatePostInput.id,
        'owner.id': user.id,
        'owner.username': user.username,
      },
      {
        $set: {
          title: updatePostInput.title,
          description: updatePostInput.description,
        },
      },
      { new: true },
    );
  }

  async deletePost(user: User, id: string) {
    return this.postModel.findOneAndDelete({
      _id: id,
      'owner.id': user.id,
      'owner.username': user.username,
    });
    //call postDeletedEvent after adding likes and comments functionality
  }
}
