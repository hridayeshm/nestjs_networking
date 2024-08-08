import { Injectable } from '@nestjs/common';
import { UpdateLikeInput } from './dto/update-like.input';
import { LikeRepository } from './repository/like.repository';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  likePost(user: User, id: string) {
    const values = {
      post: id,
      author: user.id,
    };
    return this.likeRepository.likePost(values);
  }

  unlikePost(user: User, id: string) {
    const filter = {
      post: id,
      author: user.id
    }
    return this.likeRepository.unlikePost(filter);
  }
}
