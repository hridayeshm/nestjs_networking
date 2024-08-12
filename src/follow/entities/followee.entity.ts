import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class FolloweeInfoType {
  @Field(() => ID)
  id: string
  
  @Field()
  username: string
}

@ObjectType()
export class FolloweeType {
  @Field(() => ID)
  id: string
  
  @Field(() => [FolloweeInfoType])
  followees: FolloweeInfoType[]
}

