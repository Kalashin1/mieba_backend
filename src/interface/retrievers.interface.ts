import { ObjectId } from 'mongodb';

export interface Retrievers {
  _id: ObjectId;
  fullName: string;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  password: string;
  address: Address;
  token: string;
  code: string;
}

export type Address = {
  street: string;
  zip: string;
  lga: string;
  state: string;
};
