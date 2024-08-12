import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
class Requester {
  @Field()
  username: string

  @Field(() => ID)
  id: string

  @Field()
  email: string
  
  @Field(() => [String])
  followers: string[]
}

@ObjectType()
export class FollowType {
  @Field()
  requester: Requester

  @Field()
  status: string
}
