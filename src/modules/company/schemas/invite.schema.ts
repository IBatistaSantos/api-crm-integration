import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type InviteCompanyDocument = InviteCompany & Document;

@Schema()
class InviteCompany {
  _id: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  })
  company_id: string;

  @Prop({
    required: true,
    enum: ['accepted', 'refused', 'waiting'],
    default: 'waiting',
  })
  status: string;
}

export const InviteCompanySchema = SchemaFactory.createForClass(InviteCompany);

export { InviteCompany };
