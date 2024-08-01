import { UserStatus } from "../enums/user-status.enum";

export interface IUser {
  username: string;
  email: string;
  password: string
  emailVerificationToken?: string
  mailVerifiedAt?: Date
  status:UserStatus
  followers: string[]
  followees: string[]
}
