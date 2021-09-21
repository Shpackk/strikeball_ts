import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
    @Prop({lowercase: true})
    user: string;

    @Prop()
    method: string;

    @Prop()
    url: string;
    
    @Prop()
    requestBody: string
}

export const LogSchema = SchemaFactory.createForClass(Log);