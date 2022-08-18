/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from 'src/interface/retrievers.interface';
export type UploadersDocument = Uploaders & Document;

@Schema({

  timestamps: true
})
export class Uploaders {
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
    required: [true, 'please provide your password'],
  })
  password: string

  @Prop({
    type: Object
  })
  address: Address

  @Prop({
    type: Object
  })
  officeAddress: Address

  @Prop()
  position: string

  @Prop({
    default: false
  })
  verified: boolean

  @Prop({
    required: [true, 'please provide your notary']
  })
  refererId: string

  @Prop()
  token: string
  
  @Prop()
  code: string
}

export const UploadersSchema = SchemaFactory.createForClass(Uploaders);