import {Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { mongo } from 'mongoose';
import { FollowStatus } from 'src/follow/enums/follow-status.enum';

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'})
    from: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'})
    to: string

    @Prop({type: String, enum: FollowStatus})
    status: FollowStatus
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);