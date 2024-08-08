import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class CommentType {
  @Field(() => ID)
  post: string;

  @Field(() => ID)
  author: string

  @Field()
  content: string
}
