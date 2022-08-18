/* eslint-disable prettier/prettier */
import { ObjectId } from 'mongodb';

export interface Doc {
  name: string;
  title: string;
  dateIssued: string;
  _id?: ObjectId;
  uploader: string;
  retrieverId: string;
  retriever: {
    _id: ObjectId;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  src: string;
  pages: number;
  key: string;
  updateAt?: string;
  size: string;
  sizeInMb: string;
  currentTransactionReference: string;
  createdAt?: string;
  authorized: boolean;
  isNotarized: boolean;
  url: string;
  signee: string;
  description: string;
  token: string;
}
