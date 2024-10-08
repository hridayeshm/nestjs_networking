import { raw, Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({timestamps: true})
export class Like extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post'})
    post: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'})
    author: mongoose.Schema.Types.ObjectId
}

export const LikeSchema = SchemaFactory.createForClass(Like);