/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { UploadedDocument as UploadedDocumentService } from 'src/providers/uploaded_document';
import { UploadedDocumentType } from 'src/schemas/document.schema';
import { Doc } from 'src/interface/doc.interface';
import { Email as EmailService } from 'src/providers/email';
import { getDownLoadUrlData, ReturnType, searchPayload } from 'src/interface/types';
import { generateDownloadLinkTemplate, generateQRCodeTemplate } from 'src/helpers/email-templates';
import { Payment } from 'src/providers/payment';
import { HttpService } from '@nestjs/axios';
import { Retrievers } from 'src/providers/retrievers';

@Controller('document')
export class UploadedDocumentController {
  constructor(
    private uploadedDocumentService: UploadedDocumentService,
    private emailService: EmailService,
    private paymentService: Payment,
    private httpService: HttpService,
    private retrieverService:Retrievers, 
  ) {}

  @Post()
  async createDocument(
    @Body() payload: Doc,
  ): Promise<ReturnType<UploadedDocumentType>> {
    try {
      console.log(payload);
      const _retriever = await this.retrieverService.getRetrieverByEmail(payload.retrieverId);
      console.log(_retriever);
      if (_retriever) {
        payload['retriever'] = { 
          fullName: _retriever.fullName,
          email: _retriever.email,
          phoneNumber: _retriever.phoneNumber,
          _id: _retriever._id
        };
        payload['retrieverId'] = _retriever._id.toString();
        const [qrcodeDataUrl, doc] =
          await this.uploadedDocumentService.createDocument(payload);
        const html = generateQRCodeTemplate({
          name: doc.retriever.fullName,
          src: qrcodeDataUrl,
        });
        await this.emailService.sendMessage({
          to: doc.retriever.email,
          from: 'noreply@trixswap.com',
          subject: 'Your QR codefor your document',
          html,
        });
        return {
          data: doc,
          status: 'success',
          message: 'Document Uploaded successfully',
          error: false,
        };
      } else {
        return {
          status: 'failed',
          message: 'No user with that email',
          error: true,
        };
      }
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Get('/:_id')
  async getDocument(
    @Param() { _id }: Pick<Doc, '_id'>,
  ): Promise<ReturnType<UploadedDocumentType>> {
    try {
      console.log(_id);
      const document = await this.uploadedDocumentService.getDocument(
        _id.toString(),
      );
      return {
        data: document,
        status: 'success',
        message: 'Document Retrieved successfully',
        error: false,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Get()
  async getDocuments(): Promise<ReturnType<UploadedDocumentType[]>> {
    try {
      const documents = await this.uploadedDocumentService.getDocuments();
      return {
        data: documents,
        status: 'success',
        message: 'All documents has been retrieved!',
        error: false,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Delete('/:_id')
  async deleteDocument(
    @Param() { _id }: Pick<Doc, '_id'>,
  ): Promise<ReturnType<any>> {
    const res = this.uploadedDocumentService.deleteDocument(_id.toString());
    if (res) {
      return {
        status: 'success',
        message: 'Document Deleted successfully!',
        error: true,
      };
    } else {
      return {
        status: 'failed',
        message: '',
        error: !res,
      };
    }
  }

  @Get('/uploader-docs/:uploader')
  async getUploaderDocuments(
    @Param() { uploader }: Pick<Doc, 'uploader'>,
  ): Promise<ReturnType<UploadedDocumentType[]>> {
    try {
      const documents = await this.uploadedDocumentService.getUploaderDocuments(
        uploader,
      );
      return {
        data: documents,
        error: false,
        status: 'success',
        message: 'documents retrieved successfully!',
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Get('/retriever-docs/:retrieverId')
  async getRetrieverDocuments(
    @Param() { retrieverId }: Pick<Doc, 'retrieverId'>,
  ): Promise<ReturnType<UploadedDocumentType[]>> {
    try {
      const documents =
        await this.uploadedDocumentService.getRetrieverDocuments(retrieverId);
      return {
        data: documents,
        error: false,
        status: 'success',
        message: 'documents retrieved successfully!',
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Post('/search')
  async searchDocument(@Body() payload: Partial<searchPayload>){
    try {
      const documents = await this.uploadedDocumentService.searchDocument(payload);
      return {
        status: 'success',
        message: 'Documents retrieved successfully!',
        data: documents,
        error: false,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'failed',
        message: error.message,
        error: true
      }
    }

  }

  @Patch('/update/:_id')
  async updateDocument(
    @Body() payload: Partial<Doc>,
    @Param() { _id }: any,
  ): Promise<ReturnType<null>> {
    const res = await this.uploadedDocumentService.updateDocument(payload, _id);
    if (res) {
      return {
        error: false,
        status: 'success',
        message: 'documents retrieved successfully!',
      };
    } else {
      return {
        status: 'failed',
        message: '',
        error: !res,
      };
    }
  }

  @Get('/retriever-doc/:retriever')
  async getRetrieverDocument(
    @Param() { _id, retrieverId }: Pick<Doc, '_id' | 'retrieverId'>,
  ): Promise<ReturnType<UploadedDocumentType>> {
    try {
      const document = await this.uploadedDocumentService.getRetrieverDocument(
        retrieverId,
        _id.toString(),
      );
      return {
        error: false,
        status: 'success',
        message: 'documents retrieved successfully!',
        data: document,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Get('/download-link/:_id')
  async getDownloadLink(@Param() { _id }: Pick<Doc, '_id'>): Promise<ReturnType<string>> {
    try {
      const doc = await this.uploadedDocumentService.getDocument(_id.toString());
      const res = await this.paymentService.VerifyTransaction(doc.currentTransactionReference);
      const status = res.data.data.status;
      if (status === 'success') {
        const downloadLinkRes = await this.httpService.get<getDownLoadUrlData>(
          `https://gelatinous-abalone-playground.glitch.me//signedUrl/${doc.key}`
        ).toPromise()

        await this.emailService.sendMessage({
          from: 'noreply@trixswap.com',
          to: doc.retriever.email,
          subject: "Document Download Link",
          html: generateDownloadLinkTemplate({ 
            url: downloadLinkRes.data.url,
            name: doc.retriever.fullName,
          })
        })

        return {
          data: downloadLinkRes.data.url,
          status: 'sucess',
          error: false,
          message: 'donwloadlink generated'
        }
      } else {
        return ({
          status: 'failed',
          error: false,
          message: 'payment has not been made'
        })
      }
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }
}
