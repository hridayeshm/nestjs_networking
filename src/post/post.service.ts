import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { User } from 'src/user/schema/user.schema';
import { PostRepository } from './repository/post.repository';
import { Args, Int } from '@nestjs/graphql';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  createPost(createPostInput: CreatePostInput, user: User) {
    const values = {
      title: createPostInput.title,
      description: createPostInput.description,
      owner: { id: user.id, username: user.username },
    };

    return this.postRepository.createPost(values);
  }

  getAllPosts(user: User, page, limit, skip) {
    const filter = {
      owner: {
        id: user.id,
        username: user.username,
      },
    };
    const options = {
      page,
      limit,
      skip
    };

    return this.postRepository.getAllPosts(filter, options);
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
