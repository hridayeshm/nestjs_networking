import { Injectable } from '@nestjs/common';
import { UpdateAuthInput } from './dto/update-auth.input';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { LoginUserInput } from 'src/user/dto/login-user.input';
import { UserRepository } from 'src/user/repository/user.repository';
import { TokenRepository } from 'src/token/repository/token.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async verifyUser(emailVerificationToken: string): Promise<User> {
    const verifiedUser = await this.userRepository.verifyUser(
      emailVerificationToken,
    );
    return verifiedUser;
  }

  async login(loginUserInput: LoginUserInput) {
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

    if (!(await this.userRepository.verifyUserStatus(user.status))) {
      throw new Error(
        'user not activated. please check mail for verification or contact administrator',
      );
    }
    const jwt_payload = {
      sub: user._id.toString(),
    };

    return this.generateAccessToken(jwt_payload);
  }

  async generateAccessToken(jwt_payload: any) {
    const accessToken = this.jwtService.sign(jwt_payload);
    const refreshToken = this.jwtService.sign(jwt_payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.tokenRepository.createToken(refreshToken, jwt_payload.sub);

    return { accessToken, refreshToken };
  }

  async generateNewAccessToken(oldRefreshToken: string) {
    const verified = this.jwtService.verify(oldRefreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    console.log(verified)

    const tokenDoc = await this.tokenRepository.get(oldRefreshToken);
    if (!tokenDoc || tokenDoc.expires < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(tokenDoc.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const jwt_payload = {
      sub: user._id.toString(),
    };

    const newAccessToken = this.jwtService.sign(jwt_payload);
    const newRefreshToken = this.jwtService.sign(jwt_payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    this.tokenRepository.updateToken(oldRefreshToken, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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
