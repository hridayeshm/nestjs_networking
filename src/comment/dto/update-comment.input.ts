import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => ID)
  post: string;

  @Field()
  content?: string;
}
