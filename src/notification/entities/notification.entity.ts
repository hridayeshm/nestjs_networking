import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationType {
  @Field()
  from: string

  @Field()
  to: string

  @Field()
  status: string
}
