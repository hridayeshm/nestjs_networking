import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { User } from 'src/user/schema/user.schema';
import { PostRepository } from './repository/post.repository';
import { Args, Int } from '@nestjs/graphql';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  createPost(user: User, createPostInput: CreatePostInput) {
    const values = {
      title: createPostInput.title,
      description: createPostInput.description,
      owner: { id: user.id, username: user.username },
    };

    return this.postRepository.createPost(values);
  }

  getAllPosts(user: User, page, limit, skip) {
    const filter = { owner: { id: user.id, username: user.username } };
    const options = {
      page,
      limit,
      skip,
    };
    
    return this.postRepository.getAllPosts(filter, options);
  }

  getPostByID(user: User, id: string) {
    const filter = {
      id,
      owner: { id: user.id, username: user.username },
    };
    
    return this.postRepository.getPostByID(filter);
  }

  updatePost(user: User, updatePostInput: UpdatePostInput) {
    return this.postRepository.updatePost(user, updatePostInput)
  }

  deletePost(user: User, id: string) {
    return this.postRepository.deletePost(user, id);
  }
}
