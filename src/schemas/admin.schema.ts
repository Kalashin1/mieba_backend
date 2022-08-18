/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type AdminDocument = Admin & Document;

@Schema({
  timestamps: true,
})
export class Admin {
  @Prop({
    required: [true, 'please provide your username'],
  })
  username: string;

  @Prop({
    required: [true, 'please provide your password'],
  })
  password: string;

  @Prop({
    required: [true, 'please provide your email'],
  })
  email: string;

  @Prop({
    required: [true, 'Please provide your name']
  })
  fullName: string;

  @Prop()
  jwt: string;
}


export const AdminSchema = SchemaFactory.createForClass(Admin);