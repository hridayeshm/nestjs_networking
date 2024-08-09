import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from '../schema/follow.schema';
import { Notification } from 'src/notification/schema/notification.schema';
import { User } from 'src/user/schema/user.schema';
import { FollowStatus } from '../enums/follow-status.enum';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
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
      { $match: { to: user.id } },
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'follower',
        },
      },
      {
        $project: {
          requester: {
            'requester': '$follower.username',
            'id': '$follower._id',
            'email': '$follower.email',
            'requester\'s followers': '$follower.followers',
          },

          status: 1,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }
}
