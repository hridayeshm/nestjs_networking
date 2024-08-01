import { raw, Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { mongo } from 'mongoose';
import { EventStatus } from '../enums/event-status.enum';

@Schema({timestamps: true})
export class Event {
    @Prop({ type: String, required: true })
    title: string

    @Prop({ type: String, required: true })
    dscription: string

    @Prop({ type: Date, required: true })
    startDate: Date
    
    @Prop({ type: Date, required: true })
    endDate: Date

    @Prop({ type: String, required: true })
    location: string

    @Prop({ type: String, enum: EventStatus })
    status: EventStatus

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: string[]

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    organizer: string

    @Prop({ type: [Number], default: [0, 0]})
    coordinates: [number, number]
}

export const EventSchema = SchemaFactory.createForClass(Event);
