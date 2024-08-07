import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;
}

export interface CreatePostWithOwnerInfo extends CreatePostInput{
  owner: {
    id: string
    username: string
  }
}