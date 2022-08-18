/* eslint-disable prettier/prettier */
import { JWT_PAYLOAD } from './../interface/types';
import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  Retrievers as _Retrievers,
  RetrieversDocument,
} from '../schemas/retrievers';
import { InjectModel } from '@nestjs/mongoose';
import {
  Retrievers as _RetrieversInterface,
  Address,
} from 'src/interface/retrievers.interface';
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
} from 'src/helpers/auth';
import { loginPayload, resetPasswordPayload } from 'src/interface/types';

@Injectable()
export class Retrievers {
  constructor(
    @InjectModel(_Retrievers.name)
    private retrieversModels: Model<RetrieversDocument>,
  ) {}

  async createRetriever(
    _retriever: Partial<_RetrieversInterface>,
  ): Promise<_RetrieversInterface> {
    try {
      // hash the users password
      const password = await hashPassword(_retriever.password);
      // create an account for them
      const Retriever = await this.retrieversModels.create({
        ..._retriever,
        password,
      });
      // create a jwt for them
      const token = await generateJWT({
        email: _retriever.email,
        fullName: _retriever.fullName,
        phoneNumber: _retriever.phoneNumber,
        _id: Retriever._id.toString(),
      });
      // update their account with the jwt
      await Retriever.updateOne({ token });
      Retriever.token = token;
      // return the newly created user and thier jwt tokem
      return Retriever as _RetrieversInterface;
    } catch (err: any) {
      console.log(err);
      throw new HttpException(err.message, 400);
    }
  }

  async loginRetriever(payload: loginPayload): Promise<_RetrieversInterface> {
    try {
      let Retriever;
      if (!payload.phoneNumber) {
        Retriever = await this.retrieversModels
          .findOne({})
          .where({ email: payload.email });
      } else {
        Retriever = await this.retrieversModels
          .findOne({})
          .where({ phoneNumber: payload.phoneNumber });
      }

      if (!Retriever) {
        throw Error('No user exists with that email or phone number');
      }
      const result = await verifyPassword(payload.password, Retriever.password);
      if (!result) {
        throw Error('Incorrect Password');
      }
      const token = await generateJWT({
        email: Retriever.email,
        fullName: Retriever.fullName,
        phoneNumber: Retriever.phoneNumber,
        _id: Retriever._id.toString(),
      });
      await Retriever.updateOne({ token });
      Retriever.token = token;
      return Retriever as _RetrieversInterface;
    } catch (err: any) {
      throw new HttpException(err.message, 401);
    }
  }

  async ResetPassword(payload: resetPasswordPayload): Promise<boolean> {
    const _Retriever = await this.retrieversModels.findOne({
      code: payload.code,
    });

    if (!_Retriever) {
      throw Error('Incorrect code');
    }

    const password = await hashPassword(payload.password);
    const result = await verifyPassword(payload.password, _Retriever.password)
    if (result) {
      throw Error('New password cannot be equal to old password');
    }
    await _Retriever.updateOne({ password, code: 0 });
    return true;
  }

  async getRetrievers(): Promise<_RetrieversInterface[]> {
    const _Retrievers = await this.retrieversModels.find({});
    return _Retrievers as _RetrieversInterface[];
  }

  async generatePasswordResetToken(id: string): Promise<number> {
    const code = Math.floor(Math.random() * 1000000);
    const retrievers = await this.retrieversModels.findById(id);
    if (!retrievers) {
      throw Error('No user with that id');
    }
    await retrievers.updateOne({ code });
    return code;
  }

  async getRetrieverByToken(token: string): Promise<_RetrieversInterface> {
    const payload = (await verifyJWT(token)) as JWT_PAYLOAD;

    const retrievers = await this.retrieversModels.findById(payload._id);

    return retrievers as _RetrieversInterface;
  }

  async getRetrieverById(id: string): Promise<_RetrieversInterface> {
    const Retriever = await this.retrieversModels.findById(id);
    return Retriever as _RetrieversInterface;
  }

  async getRetrieverByEmail(email: string): Promise<_RetrieversInterface> {
    const Retriever = await this.retrieversModels.findOne({ email });
    return Retriever as _RetrieversInterface;
  }

  async verifyEmail(token: string): Promise<boolean> {
    type JWT_EMAIL_DATA = { email: string };

    const payload = (await verifyJWT(token)) as JWT_EMAIL_DATA;
    const retriever = await this.retrieversModels.findOne({
      email: payload.email,
    });

    if (retriever) {
      await retriever.updateOne({ emailVerified: true });
      return true;
    } else {
      return false;
    }
  }

  async updateRetrieverAddress(address: Address, id: string): Promise<boolean> {
    console.log(address);
    const retriever = await this.retrieversModels.findById(id);
    if (retriever) {
      await retriever.updateOne({ address });
      return true;
    } else {
      return false;
    }
  }

  async generateEmailJWT(
    email: string,
  ): Promise<[string, _RetrieversInterface]> {
    const retriever = await this.retrieversModels.findOne({ email });
    const token = await generateJWT({
      email: retriever.email,
    });
    return [token, retriever as _RetrieversInterface];
  }
}
