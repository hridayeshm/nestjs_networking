import { Injectable } from '@nestjs/common';
import { UpdateAuthInput } from './dto/update-auth.input';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { LoginUserInput } from 'src/user/dto/login-user.input';
import { UserRepository } from 'src/user/repository/user.repository';
import { TokenRepository } from 'src/token/repository/token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private jwtService: JwtService,
  ) {}

  async verifyUser(emailVerificationToken: string): Promise<User> {
    const verifiedUser = await this.userRepository.verifyUser(
      emailVerificationToken,
    );
    return verifiedUser;
  }

  async login(loginUserInput: LoginUserInput): Promise<string> {
    const user = await this.userRepository.verifyEmail(loginUserInput.email);
    if (!user) {
      throw new Error('user not found');
    }
    if (
      !(await this.userRepository.verifyPassword(
        loginUserInput.password,
        user.password,
      ))
    ) {
      throw new Error('login with correct email and password');
    }
    if (user.status === 'inactive' || user.status === 'blocked') {
      throw new Error(
        'user not activated. please check mail for verification or contact administrator',
      );
    }
    const uuid = uuidv4();

    const jwt_payload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
      uuid: uuid,
    };
    this.tokenRepository.createToken(user, uuid);

    return  this.jwtService.signAsync(jwt_payload);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
