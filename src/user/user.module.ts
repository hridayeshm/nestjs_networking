import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './schema/user.schema';
import { UserRepository } from './repository/user.repository';
import { Post, PostSchema } from 'src/post/schema/post.schema';
import { TokenModule } from 'src/token/token.module';
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    TokenModule,
    OtpModule,
    EmailModule
  ],
  providers: [UserService, UserResolver, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
