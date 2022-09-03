/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doc } from 'src/interface/doc.interface';
import {
  UploadedDocumentType,
  UploadedDocument as _UploadedDocument,
} from 'src/schemas/document.schema';
import { generateJWT } from 'src/helpers/auth';
import { searchPayload } from 'src/interface/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

@Injectable()
export class UploadedDocument {
  constructor(
    @InjectModel(_UploadedDocument.name)
    private uploadedDocumentModel: Model<UploadedDocumentType>,
  ) {}

  async createDocument(payload: Partial<Doc>): Promise<[string, Doc]> {
    const doc = await this.uploadedDocumentModel.create(payload);
    const token = await generateJWT({ _id: doc._id.toString() });
    await doc.updateOne({ token });
    const url = `https://meiba-frontend.vercel.app/verify/document/${token}`;
    const dataUrl: string = await QRCode.toDataURL(url);
    // console.log(dataUrl);
    return [dataUrl, doc as Doc];
  }

  async getDocument(id: string): Promise<UploadedDocumentType> {
    const doc = await this.uploadedDocumentModel.findById(id);
    return doc;
  }

  async getDocuments(): Promise<UploadedDocumentType[]> {
    return await this.uploadedDocumentModel.find({});
  }

  async deleteDocument(id: string): Promise<boolean> {
    const _document = await this.uploadedDocumentModel.findById(id);
    if (_document) {
      await _document.deleteOne();
      return true;
    } else {
      return false;
    }
  }

  async getRetrieverDocuments(
    retrieverId: string,
  ): Promise<UploadedDocumentType[]> {
    return (await this.uploadedDocumentModel.find({
      retrieverId,
    })) as UploadedDocumentType[];
  }

  async updateDocument(
    documentPayload: Partial<Doc>,
    id: string,
  ): Promise<boolean> {
    const document = await this.uploadedDocumentModel.findById(id);

    if (document) {
      await document.updateOne({ ...documentPayload });
      return true;
    } else {
      return false;
    }
  }

  async getRetrieverDocument(
    retrieverId: string,
    documentId: string,
  ): Promise<UploadedDocumentType> {
    return await this.uploadedDocumentModel.findOne({
      retrieverId,
      _id: documentId,
    });
  }

  async getUploaderDocuments(
    uploaderId: string,
  ): Promise<UploadedDocumentType[]> {
    console.log(uploaderId);
    return await this.uploadedDocumentModel.find({
      uploader: uploaderId,
    });
  }

  async searchDocument(payload: Partial<searchPayload>): Promise<Doc[]> {
    let documents = await this.uploadedDocumentModel.find({"retriever.email": payload.email});

    if (documents.length < 1) {
      documents = await this.uploadedDocumentModel.find({ name: payload.title })
    }
    
    if (documents) {
      return documents;
    } else {
      throw Error('No document found!');
    }
  }
}
