import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OwnerDocument = HydratedDocument<Owner>;
@Schema()
export class Owner {
  @Prop({
    required: true,
    type: String,
  })
  name: string;
}
export const OwnerSchema = SchemaFactory.createForClass(Owner);
