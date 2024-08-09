import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { mongo } from 'mongoose';

@Schema({ timestamps: true })
export class Follow {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'})
    follower: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'})
    followee: string
}

export const FollowSchema = SchemaFactory.createForClass(Follow);