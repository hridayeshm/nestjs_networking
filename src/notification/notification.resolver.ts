import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { NotificationType } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Resolver(() => NotificationType)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => NotificationType)
  createNotification(@Args('createNotificationInput') createNotificationInput: CreateNotificationInput) {
    return this.notificationService.create(createNotificationInput);
  }

  @Query(() => [NotificationType], { name: 'notification' })
  findAll() {
    return this.notificationService.findAll();
  }

  @Query(() => NotificationType, { name: 'notification' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.findOne(id);
  }

  @Mutation(() => NotificationType)
  updateNotification(@Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput) {
    return this.notificationService.update(updateNotificationInput.id, updateNotificationInput);
  }

  @Mutation(() => NotificationType)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.remove(id);
  }
}
