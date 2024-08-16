import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthInput } from './dto/update-auth.input';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/repository/user.repository';
import { TokenRepository } from 'src/token/repository/token.repository';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { OtpRepository } from 'src/otp/repository/otp.repository';
import { VerifyOtpResponse } from './entities/verifyOtp-response.entity';
import * as crypto from 'crypto';
import { NodeMailerService } from 'src/service/nodemailer.service';
import { LogoutUserInput } from './dto/logout-user.input';
import { LogoutResponse } from './entities/logout-response.entity';
import { LoginUserInput } from './dto/login-user.input';
import { generateOtp } from 'src/utils/generate.otp';
import { User } from 'src/user/schema/user.schema';
import { PasswordResetRequestResponse } from './entities/password-reset-request.response';
import { EmailService } from 'src/email/email.service';
import { ChangePasswordType } from './entities/change-password.entity';
import { ChangePasswordInput } from './dto/change-password.input';
import { PasswordResetInput } from './dto/reset-password.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly otpRepository: OtpRepository,
    private jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async verifyOtp(otp: string): Promise<VerifyOtpResponse> {
    const otpDoc = await this.otpRepository.findOne(otp);

    if (!otpDoc || otpDoc.isUsed || otpDoc.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    otpDoc.isUsed = true;

    await this.userRepository.verifyUser(otpDoc.userId);

    return {
      message: 'Otp verification successfull',
      otpId: otpDoc.id,
    };
  }

  async resendOtp(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const otp: string = generateOtp();
    const otpDoc = await this.otpRepository.createOtp(user, otp);
    const nodeMailerService = new NodeMailerService();
    nodeMailerService.sendVerficationMail(user, otpDoc.otp);
    return {
      message: 'Otp send successfully',
      otpId: otpDoc.id,
    };
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
    const uuid = uuidv4();
    const jwt_refresh_payload = { ...jwt_payload, uuid };
    const refreshToken = this.jwtService.sign(jwt_refresh_payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.tokenRepository.createToken(jwt_refresh_payload);

    return { accessToken, refreshToken };
  }

  async generateNewAccessToken(oldRefreshToken: string) {
    const decoded_refresh_token = this.jwtService.verify(oldRefreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    const tokenDoc = await this.tokenRepository.find(decoded_refresh_token);
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
    const uuid = uuidv4();
    const jwt_refresh_payload = { ...jwt_payload, uuid };

    const newAccessToken = this.jwtService.sign(jwt_payload);
    const newRefreshToken = this.jwtService.sign(jwt_refresh_payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    this.tokenRepository.updateToken(
      decoded_refresh_token,
      jwt_refresh_payload,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async changePassword(user: User, changePasswordInput: ChangePasswordInput) {
    const foundUser = await this.userRepository.changePassword(user, changePasswordInput.newPassword);

    if (changePasswordInput.logoutFromAllDevices) {
      await this.tokenRepository.deleteUserAllTokens(foundUser.id);
    }
    return {
      message: 'Password change successful',
    };
  }

  async passwordResetRequest(
    email: string,
  ): Promise<PasswordResetRequestResponse> {
    try {

      const user = await this.userRepository.verifyEmail(email);
      if (!user) {
        return {
          message: 'User with provided email does not exist.',
        };
      }
      const otp = generateOtp();
      const otpDoc = await this.otpRepository.createOtp(user, otp);

      this.emailService.sendMail({
        user: user,
        subject: 'Password Reset Email',
        token: otp,
      });
      const jwt_payload = {
        sub: user.id,
        otpId: otpDoc.id,
      };
      const token = await this.jwtService.signAsync(jwt_payload);
//also send refresh token if want
      return {
        message: 'Password reset email sent.',
        token: token,
        userId: user.id,
      };
    } catch (err) {
      throw err;
    }
  }

  async passwordReset(
    requestPwdResetInput: PasswordResetInput,
  ): Promise<ChangePasswordType> {
    try {
      const { password, token } = requestPwdResetInput;
      let decodedToken;
      try {
        decodedToken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        throw new BadRequestException('Token expired');
      }

      const user = await this.userRepository.findById(decodedToken.sub);
      const otpDoc = await this.otpRepository.findById(decodedToken.otpId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!otpDoc) {
        throw new BadRequestException('Token expired');
      }

      if (!otpDoc.isUsed) { //need to have called verify otp resolver manually for this to work as expected
        throw new BadRequestException('Please validate otp');
      }
      await otpDoc.deleteOne();

      user.password = password;
      await user.save();
      return {
        message: 'Password reset successfull',
      };
    } catch (err) {
      throw err;
    }
  }

  async logout(logoutUserInput: LogoutUserInput): Promise<LogoutResponse> {
    try {
      const decoded_refresh_token = await this.jwtService.verifyAsync(
        logoutUserInput.refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );

      if (!decoded_refresh_token) {
        throw new BadRequestException('Token Expired');
      }

      if (logoutUserInput.logoutFromAllDevices) {
        this.tokenRepository.deleteUserAllTokens(decoded_refresh_token.userId);
        return {
          message: 'User logged out from all devices',
        };
      } else {
        this.tokenRepository.deleteOne(decoded_refresh_token.uuid);
        return {
          message: 'User logout successful',
        };
      }
    } catch (err) {
      throw err;
    }
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
