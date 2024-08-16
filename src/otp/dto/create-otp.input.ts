import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOtpInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
