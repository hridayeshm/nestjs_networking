import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Follow } from '../schema/follow.schema';
import { Notification } from 'src/notification/schema/notification.schema';
import { User } from 'src/user/schema/user.schema';
import { FollowStatus } from '../enums/follow-status.enum';
import { RespondToRequestInput } from '../dto/respond-to-request.input';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async sendFollowRequest(user: User, id: string) {
    const notification = new this.notificationModel({
      from: user.id,
      to: id,
      status: FollowStatus.Requested,
    });
    await notification.save();

    return notification;
  }

  async getAllNotifications(user: User) {
    return this.notificationModel.aggregate([
      { $match: { to: new mongoose.Types.ObjectId(user.id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'follower',
        },
      },
      { $unwind: '$follower' },
      {
        $project: {
          requester: {
            username: '$follower.username',
            id: '$follower._id',
            email: '$follower.email',
            followers: '$follower.followers',
          },

          status: 1,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async rejectRequest(
    user: User,
    respondToRequestInput: RespondToRequestInput,
  ) {
    return this.notificationModel.findOneAndUpdate(
      { from: respondToRequestInput.id, to: user.id },
      {
        status: 'rejected',
      },
      { new: true },
    );
  }

  async acceptRequest(
    user: User,
    respondToRequestInput: RespondToRequestInput,
  ) {
    await this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $push: { followers: respondToRequestInput.id },
      },
      {
        new: true,
      },
    );

    await this.userModel.findOneAndUpdate(
      { _id: respondToRequestInput.id },
      {
        $push: { followees: user.id },
      },
      { new: true },
    );

    const follow = new this.followModel({
      follower: respondToRequestInput.id,
      followee: user.id,
    });
    await follow.save();

    return this.notificationModel.findOneAndUpdate(
      { from: respondToRequestInput.id, to: user.id },
      {
        status: 'accepted',
      },
      { new: true },
    );
  }

  async listFollowers(user: User) {
    const test = await this.userModel
      .find({ _id: user.id })
      .populate('followers', 'id username')
      .select('followers')
      .exec();
      console.log(test)

      return test
  }

  async listFollowees(user: User) {
    return this.userModel
      .find({ _id: user.id })
      .populate('followees', '_id username')
      .select('followees')
      .exec();
  }
}
