import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from './repository/auth.repository';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenModule } from 'src/token/token.module';
import { RefreshToken, RefreshTokenSchema } from 'src/token/schema/token.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    UserModule,
    PassportModule,
    TokenModule
  ],
  providers: [AuthResolver, AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
