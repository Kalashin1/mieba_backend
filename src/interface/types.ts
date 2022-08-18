/* eslint-disable prettier/prettier */
export type JWT_PAYLOAD = {
  _id: string;
  fullName: string;
  phoneNumber?: string;
  username?: string;
  email: string;
}

export const JWT_AUTH_SECRETE = 'JWT_TEST_SECRETE_1234';

export const DOCUMENT_JWT_SECRETE = 'Document_Secrete_100';

export type loginPayload = {
  phoneNumber?: string;
  email?: string;
  password: string
}

export type resetPasswordPayload = {
  code: string;
  password: string;
}

export const JWT_AUTH_EXPIRY_DATE = 60 * 60 * 24 * 7;

export interface EmailPayload {
  to: string | string [],
  from: string,
  plain?: string,
  html?:  string,
  subject: string
  attachment?: Attachment[]
}

export type Attachment = {
  content: string,
  file_name: string,
  content_type: string,
  size: 8,
  disposition: 'attachment' | 'inline',
  content_id: string
}

export interface EmailResponse {
  id?: string;
  from: string;
  to: string | string[];
  test_mode?: boolean;
  subject?: string;
  tags?: string | string[];
}

export interface ReturnType<T> {
  status: string;
  message: string;
  error: boolean;
  data?: T;
}

export interface getDownLoadUrlData {
  url: string;
}

export interface searchPayload {
  title: string;
  signee: string;
  email: string;
}