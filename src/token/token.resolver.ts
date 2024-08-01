import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';
import { CreateTokenInput } from './dto/create-token.input';
import { UpdateTokenInput } from './dto/update-token.input';

@Resolver(() => Token)
export class TokenResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Mutation(() => Token)
  createToken(@Args('createTokenInput') createTokenInput: CreateTokenInput) {
    return this.tokenService.create(createTokenInput);
  }

  @Query(() => [Token], { name: 'token' })
  findAll() {
    return this.tokenService.findAll();
  }

  @Query(() => Token, { name: 'token' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tokenService.findOne(id);
  }

  @Mutation(() => Token)
  updateToken(@Args('updateTokenInput') updateTokenInput: UpdateTokenInput) {
    return this.tokenService.update(updateTokenInput.id, updateTokenInput);
  }

  @Mutation(() => Token)
  removeToken(@Args('id', { type: () => Int }) id: number) {
    return this.tokenService.remove(id);
  }
}
