import { Injectable } from '@nestjs/common';
import { UpdateLikeInput } from './dto/update-like.input';
import { LikeRepository } from './repository/like.repository';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  likePost(user: User, postID: string) {
    const values = {
      post: postID,
      author: user.id,
    };
    return this.likeRepository.likePost(values);
  }

  unlikePost(user: User, postID: string) {
    const filter = {
      post: postID,
      author: user.id
    }
    return this.likeRepository.unlikePost(filter);
  }
}
