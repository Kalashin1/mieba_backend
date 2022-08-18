/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Uploaders as _UploaderService } from 'src/providers/uploaders';
import { Uploaders } from 'src/interface/uploaders.interface';
import { EmailPayload, loginPayload } from 'src/interface/types';
import { Address } from 'src/interface/retrievers.interface';
import { ReturnType } from 'src/interface/types';
import { Email as EmailService } from 'src/providers/email';
import { generateVerifyEmailTemplate } from 'src/helpers/email-templates';

@Controller('uploaders')
export class UploadersController {
  constructor(
    private uploaderService: _UploaderService,
    private emailService: EmailService,
  ) {}

  @Post('signup')
  async CreateUploader(
    @Body() uploader: Uploaders,
  ): Promise<ReturnType<Uploaders>> {
    try {
      const Uploader = await this.uploaderService.createUploader(uploader);
      await this.sendEmailVerificationEmail({ email: Uploader.email });
      return {
        status: 'success',
        message: 'Notary public created successfully',
        error: false,
        data: Uploader,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Post('login')
  async Login(@Body() payload: loginPayload): Promise<ReturnType<Uploaders>> {
    try {
      const Uploader = await this.uploaderService.login(payload);
      return {
        status: 'success',
        message: 'Login successfull',
        error: false,
        data: Uploader,
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
  async GetAllUploaders(): Promise<ReturnType<Uploaders[]>> {
    try {
      const __Uploaders = await this.uploaderService.getUploaders();
      return {
        status: 'success',
        message: 'Available Notary Publics',
        error: false,
        data: __Uploaders,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Get('/id/:_id')
  async getUploaderById(
    @Param() param: Pick<Uploaders, '_id'>,
  ): Promise<ReturnType<Uploaders>> {
    try {
      const Uploader = await this.uploaderService.getUploaderById(
        param._id.toString(),
      );
      return {
        status: 'success',
        message: 'Notary public gotten successfully',
        error: false,
        data: Uploader,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Post('/verify/email/:token')
  async verifyEmail(
    @Param() { token }: Pick<Uploaders, 'token'>,
  ): Promise<ReturnType<Uploaders>> {
    const res = this.uploaderService.verifyEmail(token);
    if (res) {
      return {
        status: 'success',
        message: 'Email Verified successfully',
        error: false,
      };
    } else {
      return {
        status: 'failed',
        message: 'Invalid token',
        error: true,
      };
    }
  }

  @Get('/token/:token')
  async getUploaderByToken(@Param() param: Pick<Uploaders, 'token'>) {
    try {
      const Uploader = await this.uploaderService.getUploaderByToken(
        param.token,
      );
      return {
        status: 'success',
        message: 'Notary public gotten successfully',
        error: false,
        data: Uploader,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: error.message,
        error: true,
      };
    }
  }

  @Post('/update/address/:_id')
  async changeUploaderAddress(
    @Param() param: Pick<Uploaders, '_id'>,
    @Body() payload: Address,
  ) {
    const result = await this.uploaderService.editAddress(
      payload,
      param._id.toString(),
    );
    if (result) {
      return {
        status: result,
        message: 'Address updated successfuly',
      };
    } else {
      return {
        status: false,
        message: 'Something happended, try again',
        error: true,
      };
    }
  }

  @Post('/update/office/address/:_id')
  async changeUploaderOfficeAddress(
    @Param() param: Pick<Uploaders, '_id'>,
    @Body() payload: Address,
  ) {
    const result = await this.uploaderService.editOfficeAddress(
      payload,
      param._id.toString(),
    );
    if (result) {
      return {
        status: result,
        message: 'Address updated successfuly',
      };
    } else {
      return {
        status: false,
        message: 'Something happended, try again',
        error: true,
      };
    }
  }

  @Get('/request-password-reset/:email')
  async requestPasswordResetEmail(
    @Param() param: Pick<Uploaders, 'email'>,
  ): Promise<ReturnType<any>> {
    try {
      console.log(param.email);
      const uploader = await this.uploaderService.getUploaderByEmail(
        param.email,
      );
      const code = await this.uploaderService.generatePasswordResetToken(
        uploader._id.toString(),
      );
      const emailPayload: EmailPayload = {
        from: 'noreply@trixswap.com',
        to: param.email,
        subject: 'Password Reset Code',
        plain: `Use the code provided to reset your password, ${code}`,
      };
      const response = await this.emailService.sendMessage(emailPayload);
      console.log(response, code);
      return {
        message: 'Email reset password sent!',
        status: 'success',
        error: false,
      };
    } catch (error) {
      return {
        message: error.message,
        status: 'failed',
        error: true,
      };
    }
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() { code, password }: Pick<Uploaders, 'code' | 'password'>,
  ): Promise<ReturnType<any>> {
    try {
      await this.uploaderService.ResetPassword({ code, password });
      return {
        status: 'success',
        error: false,
        message: 'Password reset successfully',
      };
    } catch (error) {
      return {
        status: 'failed',
        error: true,
        message: error.message,
      };
    }
  }

  @Get('/send-email-verification/:email')
  async sendEmailVerificationEmail(
    @Param() { email }: Pick<Uploaders, 'email'>,
  ): Promise<ReturnType<any>> {
    try {
      type emailJWTData = [string, Uploaders];

      const [token, uploader] = (await this.uploaderService.generateEmailJWT(
        email,
      )) as emailJWTData;
      const url = `https://api.mytonarizeng.com/retrivers/verify/email/${token}`;
      const html = generateVerifyEmailTemplate({
        name: uploader.fullName,
        url,
      });
      const res = await this.emailService.sendMessage({
        to: uploader.email,
        from: 'support@trixswap.com',
        subject: 'Verify Your Account',
        html,
      });
      console.log(res);
      return {
        status: 'success',
        message: 'Email verificatio sent',
        error: false,
      };
    } catch (error) {
      return {
        status: 'failed',
        message: 'No user with that email',
        error: true,
      };
    }
  }
}
