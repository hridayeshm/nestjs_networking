import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenResolver } from './token.resolver';
import { TokenRepository } from './repository/token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schema/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
  providers: [TokenResolver, TokenService, TokenRepository],
  exports: [TokenRepository]
})
export class TokenModule {}
