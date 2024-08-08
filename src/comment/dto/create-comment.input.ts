import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  post: string

  @Field()
  content: string;
}

export interface CreateCommentWithAuthorInfo extends CreateCommentInput {
  author: string
}
