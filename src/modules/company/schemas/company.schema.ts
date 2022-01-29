import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CompanyDocument = Company & Document;

@Schema()
class Company {
  _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  creator_id: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

export { Company };
