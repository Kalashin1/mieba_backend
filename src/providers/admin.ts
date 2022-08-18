import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  hashPassword,
  generateJWT,
  verifyJWT,
  verifyPassword,
} from 'src/helpers/auth';
import { Admin as _Admin, AdminDocument } from 'src/schemas/admin.schema';
import { Uploaders, UploadersDocument } from 'src/schemas/uploaders';
import { Uploaders as UploadersInterface } from 'src/interface/uploaders.interface';
import { Admin as AdminInterface } from 'src/interface/admin.interface';
import { Model } from 'mongoose';
import { resetPasswordPayload } from 'src/interface/types';

@Injectable()
export class Admin {
  constructor(
    @InjectModel(_Admin.name)
    private adminModel: Model<AdminInterface, AdminDocument>,
    @InjectModel(Uploaders.name)
    private uploadersModel: Model<UploadersInterface, UploadersDocument>,
  ) {}

  async createAdmin(payload: AdminInterface) {
    const password = await hashPassword(payload.password);
    delete payload.password;
    const admin = await this.adminModel.create({ ...payload, password });
    const jwt = await generateJWT({
      _id: admin._id.toString(),
      fullName: admin.fullName,
      email: admin.email,
      username: admin.username,
    });
    admin.jwt = jwt;
    return admin;
  }

  async loginAdmin(payload: AdminInterface) {
    let admin: any;
    if (payload.email) {
      admin = await this.adminModel.findOne({ email: payload.email });
    } else {
      admin = await this.adminModel.findOne({
        username: payload.username,
      });
    }

    if (!admin) {
      throw Error('Incorrect username or email');
    }

    const passwordMatch = await verifyPassword(
      payload.password,
      admin.password,
    );

    if (!passwordMatch) {
      throw Error('Incorrect password');
    }

    const jwt = await generateJWT({
      email: admin.email,
      _id: admin._id.toString(),
      fullName: admin.fullName,
      username: admin.username,
    });

    await admin.updateOne({ jwt });

    admin.jwt = jwt;
    return admin;
  }

  async getAdminByToken(token: string) {
    const payload: any = await verifyJWT(token);

    const admin = await this.adminModel.findById(payload._id);

    return admin;
  }

  async resetPassword(payload: resetPasswordPayload): Promise<boolean> {
    const admin = await this.adminModel.findOne({
      code: payload.code,
    });

    if (!admin) {
      throw Error('Incorrect code');
    }

    const password = await hashPassword(payload.password);

    if (payload.password === admin.password) {
      throw Error('Old password cannot be equal to new password');
    }
    await admin.updateOne({ password });
    return true;
  }

  async verifyUploader(uploaderId: string): Promise<boolean> {
    const uploader = await this.uploadersModel.findById(uploaderId);
    if (!uploader) {
      throw Error('Incorrect user id');
    }
    await uploader.updateOne({ verified: true });
    return true;
  }

  async generatePasswordResetToken(id: string) {
    const code = Math.floor(Math.random() * 1000000);
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw Error('No user with that id');
    }
    await admin.updateOne({ code });
    return code;
  }
}
