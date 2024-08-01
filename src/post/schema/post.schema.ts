import { raw, Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop(
    raw({
      id: { type: mongoose.Schema.Types.ObjectId },
      username: { type: String },
    }),
  )
  owner: Record<string, any>;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, default: 0 })
  commentCount: number;

  @Prop({ type: Number, default: 0 })
  likeCount: number;

  @Prop(
    raw([
      {
        content: {
          type: String,
        },
        commentedBy: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
          username: {
            type: String,
            required: true,
          },
          profile: {
            type: String,
          },
        },
      },
    ]),
  )
  latesComments: Record<string, any>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
