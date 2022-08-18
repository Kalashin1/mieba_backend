/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UploadedDocumentSchema,
  UploadedDocument,
} from 'src/schemas/document.schema';
import { UploadedDocument as UploadedDocumentService } from 'src/providers/uploaded_document';
import { UploadedDocumentController } from 'src/controllers/uploaded_document/uploaded_document.controller';
import { Email as EmailService } from 'src/providers/email';
import { HttpModule } from '@nestjs/axios';
import { Payment } from 'src/providers/payment';
import { Invoice, InvoiceSchema } from 'src/schemas/Payment.schema';
import { Retrievers as RetrieverService } from 'src/providers/retrievers';
import { RetrieverSchema, Retrievers } from 'src/schemas/retrievers';

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: UploadedDocument.name, schema: UploadedDocumentSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Retrievers.name, schema: RetrieverSchema },
    ]),
  ],
  controllers: [UploadedDocumentController],
  providers: [UploadedDocumentService, EmailService, Payment, RetrieverService],
})
export class UploadedDocumentModule {}
