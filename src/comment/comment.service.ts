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

  updateComment(user: User, updateCommentInput: UpdateCommentInput) {
    return this.commentRepository.updateComment(user, updateCommentInput);
  }

  deleteComment(user: User, id: string) {
    return this.commentRepository.deleteComment(user, id);
  }

  deleteCommentByPostOwner(user: User, postID: string, commentID: string) {
    return this.commentRepository.deleteCommentByPostOwner(user, postID, commentID);
  }
}
