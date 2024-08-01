import { registerEnumType } from "@nestjs/graphql";

export enum UserStatus {
    Active = "active",
    Inactive = "inactive",
    Blocked = "blocked"
}

registerEnumType(UserStatus, {
    name: 'UserRole', 
  });