import { Injectable } from '@nestjs/common';
import { CreateCommentInput, CreateCommentWithAuthorInfo } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CommentRepository } from './repository/comment.repository';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository){}
  createComment(user: User, createCommentInput: CreateCommentInput) {
    const values: CreateCommentWithAuthorInfo = {
      post: createCommentInput.post,
      content: createCommentInput.content, 
      author: user.id
    }
    return this.commentRepository.createComment(user, values);
  }

  getAllComments(id: string) {
    return this.commentRepository.getAllComments(id);
  }

  updateComment(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  deleteComment(id: number) {
    return `This action removes a #${id} comment`;
  }
}
