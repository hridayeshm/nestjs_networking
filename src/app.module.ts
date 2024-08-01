import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { EventModule } from './event/event.module';
import { TokenModule } from './token/token.module';


const mongoURI = 'mongodb+srv://Networking:mongoatlas123@cluster0.3ufawdp.mongodb.net/Networking-api?retryWrites=true&w=majority&appName=Cluster0'

@Module({
  imports: [
    MongooseModule.forRoot(mongoURI, {}),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      sortSchema: true,
      plugins: [ ApolloServerPluginLandingPageLocalDefault() ],
      context: ({ req }) => ({ req }),
    }),
    UserModule,
    PostModule,
    CommentModule,
    LikeModule,
    FollowModule,
    EventModule,
    TokenModule,
    
  ],

  providers: [AppService],
})
export class AppModule {}
