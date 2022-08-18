/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from 'src/interface/retrievers.interface';
export type RetrieversDocument = Retrievers & Document;

@Schema({ timestamps: true })
export class Retrievers {
  @Prop({
    required: [true, 'please provide your fullname']
  })
  fullName: string;

  @Prop({
    required: [true, 'please provide your phone number'],
    unique: true
  })
  phoneNumber: string;

  @Prop({
    required: [true, 'please provide your email'],
    unique: true
  })
  email: string

  @Prop({
    default: false
  })
  emailVerified: boolean

  @Prop({
    required: [true, 'please provide your password'],
  })
  password: string

  @Prop({
    type: Object
  })
  address: Address

  @Prop()
  token: string;

  @Prop()
  code: string
}

export const RetrieverSchema = SchemaFactory.createForClass(Retrievers)