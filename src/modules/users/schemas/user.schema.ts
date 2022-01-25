import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
class User {
  _id: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    default: true,
  })
  is_active: boolean;

  @Prop({
    required: true,
    enum: ['admin', 'empl', 'user'],
    default: 'user',
  })
  role: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: Date.now(),
  })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export { User };
