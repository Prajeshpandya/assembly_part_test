import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartDocument = Part & Document;

@Schema()
export class Part {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['RAW', 'ASSEMBLED'] })
  type: 'RAW' | 'ASSEMBLED';

  @Prop({ default: 0 })
  quantity: number;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    default: [],
  })
  parts: { id: string; quantity: number }[];
}

export const PartSchema = SchemaFactory.createForClass(Part);
