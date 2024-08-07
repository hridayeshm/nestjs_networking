import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { UserType } from 'src/user/entities/user.entity';

@ObjectType()
class CommentedBy {
  @Field(() => ID)
  id: string

  @Field()
  username: string
}

@ObjectType()
class CommentNestedInsidePost {
  @Field()
  content: string;

  @Field(() => CommentedBy)
  commentedBy: CommentedBy;
}

@ObjectType()
class Owner {
  @Field(() => ID)
  id: string

  @Field()
  username: string
}

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field(() => Owner)
  owner: Owner;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Int, { defaultValue: 0 })
  commentCount: number;

  @Field(() => Int, { defaultValue: 0 })
  likeCount: number;

  @Field(() => [CommentNestedInsidePost])
  latesComments: CommentNestedInsidePost[];
}
