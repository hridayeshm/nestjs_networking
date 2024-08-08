import { IsString } from 'class-validator';
import { CreatePostInput } from './create-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;
}
