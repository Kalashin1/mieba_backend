import { Address } from './retrievers.interface';
import { ObjectId } from 'mongodb';

export interface Uploaders {
  _id: ObjectId;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: Address;
  officeAddress: Address;
  position: string;
  refererId: string;
  verified: boolean | null;
  token: string;
  code: string;
}
