/* eslint-disable prettier/prettier */
import { Payment } from 'src/interface/payment.interface';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({
  timestamps: true,
})
export class Invoice {
  @Prop()
  name: string

  @Prop()
  email: string

  @Prop()
  phoneNumber: string

  @Prop()
  reference: string

  @Prop()
  status: string;

  @Prop()
  authorization_url: string
}


export const InvoiceSchema = SchemaFactory.createForClass(Invoice);