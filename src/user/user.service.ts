import { Injectable } from '@nestjs/common';
import { v4 as uuidv4} from 'uuid';
import { UserRepository } from './repository/user.repository';
import { User } from './schema/user.schema';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { NodeMailerService } from 'src/service/nodemailer.service';
import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(registerUserInput: RegisterUserInput): Promise<User> {
    const registerUserWithUUID = {
      ...registerUserInput,
      emailVerificationToken: uuidv4(),
    };
    const registeredUser: User = await this.userRepository.registerUser(registerUserWithUUID);
    const nodeMailerService = new NodeMailerService();
    nodeMailerService.sendVerficationMail(registeredUser);
    return registeredUser;
  }

  async verifyUser(emailVerificationToken: string): Promise<User> {
    const verifiedUser = await this.userRepository.verifyUser(emailVerificationToken);
    return verifiedUser;
  }

  async login(loginUserInput: LoginUserInput): Promise<User> {
    const user = await this.userRepository.verifyEmail(loginUserInput.email);
    if (!user) {
      throw new Error("user not found");
    }
    if (!(await this.userRepository.verifyPassword(loginUserInput.password, user.password))) {
      throw new Error("login with correct email and password");
    }
    if (user.status === "inactive" || user.status === "blocked") {
      throw new Error(
        "user not activated. please check mail for verification or contact administrator"
      );
    }
    return user; 
  }
  
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}






