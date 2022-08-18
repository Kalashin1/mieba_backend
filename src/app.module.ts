import { Module, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RetrieversController } from './controllers/retrievers/retrievers.controller';
import { RetrieversModule } from './modules/retrievers/retrievers.module';
import { RetrieverSchema, Retrievers } from './schemas/retrievers';
import { Retrievers as RetrieverService } from './providers/retrievers';
import { Uploaders } from './providers/uploaders';
import { UploadersModule } from './modules/uploaders/uploaders.module';
import { UploadersController } from './controllers/uploaders/uploaders.controller';
import { UploadersSchema, Uploaders as _Uploader } from './schemas/uploaders';
import { Admin as AdminService } from './providers/admin';
import { AdminController } from './controllers/admin/admin.controller';
import { AdminModule } from './modules/admin/admin.module';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { UploadedDocument as UploadedDocumentService } from './providers/uploaded_document';
import { UploadedDocumentController } from './controllers/uploaded_document/uploaded_document.controller';
import { UploadedDocumentModule } from './modules/uploaded_document/uploaded_document.module';
import {
  UploadedDocumentSchema,
  UploadedDocument,
} from 'src/schemas/document.schema';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentController } from './controllers/payment/payment.controller';
import { Payment as PaymentService } from './providers/payment';
import { Invoice, InvoiceSchema } from './schemas/Payment.schema';
import { Email } from './providers/email';

// mongodb+srv://kalashin:Kalashin1@cluster0.4umw1.gcp.mongodb.net/retala?retryWrites=true&w=majority
// mongodb://localhost:27017/meiba-backend

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
    Logger,
    MongooseModule.forRoot(
      // 'mongodb://localhost:27017/meiba-backend',
      'mongodb+srv://kalashin:Kalashin1@cluster0.4umw1.gcp.mongodb.net/retala?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: Retrievers.name, schema: RetrieverSchema },
      { name: _Uploader.name, schema: UploadersSchema },
      { name: UploadedDocument.name, schema: UploadedDocumentSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
    RetrieversModule,
    UploadersModule,
    AdminModule,
    UploadedDocumentModule,
    PaymentModule,
  ],
  controllers: [
    AppController,
    RetrieversController,
    UploadersController,
    AdminController,
    UploadedDocumentController,
    PaymentController,
  ],
  providers: [
    AppService,
    RetrieverService,
    Uploaders,
    AdminService,
    UploadedDocumentService,
    PaymentService,
    Email,
  ],
})
export class AppModule {}
