/* eslint-disable prettier/prettier */
import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UploadersDocument,
  Uploaders as _Uploaders,
} from 'src/schemas/uploaders';
import { Uploaders as _UploadersInterface } from 'src/interface/uploaders.interface';
import { Address } from 'src/interface/retrievers.interface';
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
} from 'src/helpers/auth';
import { loginPayload, resetPasswordPayload } from 'src/interface/types';

@Injectable()
export class Uploaders {
  constructor(
    @InjectModel(_Uploaders.name)
    private uploadersModel: Model<UploadersDocument>,
  ) {}

  async createUploader(
    _uploader: _UploadersInterface,
  ): Promise<_UploadersInterface> {
    try {
      // hash the users password
      const password = await hashPassword(_uploader.password);
      // create an account for them
      const Uploader = await this.uploadersModel.create({
        ..._uploader,
        password,
      });
      console.log(Uploader);
      // create a jwt for them
      const token = await generateJWT({
        email: _uploader.email,
        fullName: _uploader.fullName,
        phoneNumber: _uploader.phoneNumber,
        _id: Uploader._id.toString(),
      });
      // save the token to the DB
      await Uploader.updateOne({ token });
      Uploader.token = token;
      // return the uploader
      return Uploader;
    } catch (err: any) {
      throw new HttpException(err.message, 400);
    }
  }

  async login(payload: loginPayload): Promise<_UploadersInterface> {
    try {
      const Uploader = await this.uploadersModel
        .findOne({
          email: payload.email,
          $or: [{ phoneNUmber: payload.phoneNumber }],
        })
        .exec();
      console.log(Uploader);
      if (!Uploader) {
        throw Error('No user exists with that email or phone number');
      }
      const result = await verifyPassword(payload.password, Uploader.password);
      if (!result) {
        throw Error('Incorrect Password');
      }
      const token = await generateJWT({
        email: Uploader.email,
        fullName: Uploader.fullName,
        phoneNumber: Uploader.phoneNumber,
        _id: Uploader._id.toString(),
      });
      await Uploader.updateOne({ token });
      Uploader.token = token;
      return Uploader as _UploadersInterface;
    } catch (err: any) {
      throw new HttpException(err.message, 401);
    }
  }

  async ResetPassword(payload: resetPasswordPayload): Promise<boolean> {
    const Uploader = await this.uploadersModel.findOne({
      code: payload.code,
    });

    if (!Uploader) {
      throw Error('Incorrect code');
    }

    const password = await hashPassword(payload.password);
    const result = await verifyPassword(payload.password, Uploader.password)
    if (result) {
      throw Error('Old password cannot be equal to new password');
    }
    await Uploader.updateOne({ password });
    return true;
  }

  async getUploaders(): Promise<_UploadersInterface[]> {
    return await this.uploadersModel.find({});
  }

  async getUploaderById(id: string) {
    return await this.uploadersModel.findById(id);
  }

  async getUploaderByEmail(email: string): Promise<_UploadersInterface> {
    const Uploader = (await this.uploadersModel.findOne({
      email,
    })) as _UploadersInterface;
    return Uploader;
  }

  async getUploaderByToken(token: string): Promise<_UploadersInterface> {
    const payload: any = await verifyJWT(token);
    const uploader = (await this.uploadersModel.findById(
      payload._id,
    )) as _UploadersInterface;
    return uploader;
  }

  async generatePasswordResetToken(id: string): Promise<number> {
    const code = Math.floor(Math.random() * 1000000);
    const uploader = await this.uploadersModel.findById(id);
    if (!uploader) {
      throw Error('No user with that id');
    }
    await uploader.updateOne({ code });
    return code;
  }

  async editAddress(payload: Address, id: string): Promise<boolean> {
    const uploader = this.uploadersModel.findById(id);
    if (uploader) {
      await uploader.updateOne({ address: payload });
      return true;
    } else {
      return false;
    }
  }

  async editOfficeAddress(payload: Address, id: string): Promise<boolean> {
    const uploader = this.uploadersModel.findById(id);
    if (uploader) {
      await uploader.updateOne({ officeAddress: payload });
      return true;
    } else {
      return false;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    type JWT_EMAIL_DATA = { email: string };

    const payload = (await verifyJWT(token)) as JWT_EMAIL_DATA;
    const uploader = await this.uploadersModel.findOne({
      email: payload.email,
    });

    if (uploader) {
      await uploader.updateOne({ emailVerified: true });
      return true;
    } else {
      return false;
    }
  }

  async generateEmailJWT(
    email: string,
  ): Promise<[string, _UploadersInterface]> {
    const retriever = await this.uploadersModel.findOne({ email });
    const token = await generateJWT({
      email: retriever.email,
    });
    return [token, retriever as _UploadersInterface];
  }
}
