import { registerEnumType } from "@nestjs/graphql";

export enum EventStatus {
    Active = "active",
    Ended = "ended",
    Ongoing = "ongoing"
}

registerEnumType(EventStatus, {
    name: 'UserRole', 
  });