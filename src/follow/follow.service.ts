import { Injectable } from '@nestjs/common';
import { FollowRepository } from './repository/follow.repository';
import { User } from 'src/user/schema/user.schema';
import { RespondToRequestInput } from './dto/respond-to-request.input';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}
  sendFollowRequest(user: User, id: string) {
    return this.followRepository.sendFollowRequest(user, id);
  }

  getAllNotifications(user: User) {
    return this.followRepository.getAllNotifications(user);
  }

  listFollowers(user: User) {
    return this.followRepository.listFollowers(user);
  }

  listFollowees(user: User) {
    return this.followRepository.listFollowees(user);
  }

  respondToRequest(user: User, respondToRequestInput: RespondToRequestInput) {
    if (respondToRequestInput.action.toLowerCase() === 'reject') {
      return this.followRepository.rejectRequest(user, respondToRequestInput);
    } else if (respondToRequestInput.action.toLowerCase() === 'accept') {
      return this.followRepository.acceptRequest(user, respondToRequestInput);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
