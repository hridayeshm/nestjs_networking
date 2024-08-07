import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { PostRepository } from './repository/post.repository';

@Module({
  imports:[MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
