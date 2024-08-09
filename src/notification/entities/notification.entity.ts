import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @Field()
  from: string;

  @Field()
  to: string

  @Field()
  status: string
}
