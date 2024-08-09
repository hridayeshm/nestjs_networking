import { Injectable } from '@nestjs/common';
import { CreateFollowInput } from './dto/create-follow.input';
import { UpdateFollowInput } from './dto/update-follow.input';
import { FollowRepository } from './repository/follow.repository';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository){}
  sendFollowRequest(user: User, id: string) {
    return this.followRepository.sendFollowRequest(user, id);
  }

  getAllNotifications(user: User) {
    return this.followRepository.getAllNotifications(user);
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  update(id: number, updateFollowInput: UpdateFollowInput) {
    return `This action updates a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
