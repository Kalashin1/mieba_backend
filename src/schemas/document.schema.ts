/* eslint-disable prettier/prettier */
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
export type UploadedDocumentType = UploadedDocument & Document;

@Schema({ 
  timestamps: true
})
export class UploadedDocument {

  @Prop()
  name: string

  @Prop()
  title: string

  @Prop()
  signee: string

  @Prop()
  description: string

  @Prop()
  dateIssued: string

  @Prop()
  token: string

  @Prop()
  uploader: string

  @Prop()
  retrieverId: string

  @Prop({
    type: Object
  })
  retriever: {
    fullName: string,
    email: string,
    phoneNumber: string,
    _id: ObjectId
  }

  @Prop()
  src: string

  @Prop()
  size: string

  @Prop()
  sizeInMb: string

  @Prop({
    default: false
  })
  isNotarized: boolean

  @Prop()
  key: string

  @Prop({
    default: false
  })
  authorized: boolean;

  @Prop()
  pages: number

  @Prop()
  url: string

  @Prop()
  currentTransactionReference: string

  @Prop()
  notarizationTransactionReference: string
  
}

export const UploadedDocumentSchema = SchemaFactory.createForClass(UploadedDocument);