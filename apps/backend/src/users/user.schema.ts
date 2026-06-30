import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  identifier: string; // Email or Phone

  @Prop({ required: false })
  passwordHash?: string;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop()
  name: string;

  @Prop()
  avatarUrl: string;

  @Prop({ default: 'athlete' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
