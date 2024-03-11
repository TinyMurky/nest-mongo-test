// https://docs.nestjs.com/techniques/mongodb
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Owner
import { Owner } from './owner.schema';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({
    required: true,
    type: String, // for practice
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
  })
  owner: Owner;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
