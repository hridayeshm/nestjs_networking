import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class FollowerInfoType {
  @Field(() => ID)
  id: string
  
  @Field()
  username: string
}

@ObjectType()
export class FollowerType {
  @Field(() => ID)
  id: string
  
  @Field(() => [FollowerInfoType])
  followers: FollowerInfoType[]
}

