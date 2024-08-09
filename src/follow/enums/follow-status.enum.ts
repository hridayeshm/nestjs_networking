import { registerEnumType } from '@nestjs/graphql';

export enum FollowStatus {
  Requested = 'requested',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

registerEnumType(FollowStatus, {
  name: 'FollowStatus',
});
