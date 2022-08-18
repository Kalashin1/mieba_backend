/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Retrievers as _RetrieversService } from 'src/providers/retrievers';
import { Retrievers, Address } from 'src/interface/retrievers.interface';
import { EmailPayload, loginPayload } from 'src/interface/types';
import { Email as EmailService } from 'src/providers/email';
import { generateVerifyEmailTemplate } from 'src/helpers/email-templates';
import { ReturnType } from 'src/interface/types';

@Controller('retrievers')
export class RetrieversController {
  constructor(
    private retrieversService: _RetrieversService,
    private emailService: EmailService,
  ) {}

  @Post('/signup')
  async createRetriever(
    @Body() obj: Retrievers,
  ): Promise<ReturnType<Retrievers>> {
    try {
      const retriever = await this.retrieversService.createRetriever(obj);
      await this.sendEmailVerificationEmail({ email: retriever.email })
      return {
        status: 'success',
        message: 'User created successfully',
        data: retriever,
        error: false,
      };
    } catch (err) {
      return {
        status: 'failed',
        message: err.message,
        error: true,
      };
    }
  }

  @Post('/login')
  async Login(@Body() payload: loginPayload): Promise<ReturnType<Retrievers>> {
    console.log(payload);
    try {
      const Retriever = await this.retrieversService.loginRetriever(payload);
      return {
        status: 'success',
        message: 'Login successfull',
        data: Retriever,
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

  @Post('/update-password')
  async updatePassword(
    @Body() { code, password }: Pick<Retrievers, 'password' | 'code'>,
  ): Promise<ReturnType<any>> {
    try {
      const res = await this.retrieversService.ResetPassword({
        code,
        password,
      });
      return {
        status: 'success',
        message: 'Password updated successfully',
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
  async getRetriever(): Promise<ReturnType<Retrievers[]>> {
    try {
      const __Retrievers = await this.retrieversService.getRetrievers();
      return {
        status: 'success',
        message: 'Retrievers Found',
        data: __Retrievers,
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

  @Get('/token/:token')
  async getRetrieverByToken(
    @Param() param: Pick<Retrievers, 'token'>,
  ): Promise<ReturnType<Retrievers>> {
    try {
      const Retriever = await this.retrieversService.getRetrieverByToken(
        param.token,
      );
      return {
        status: 'success',
        message: 'Retriever found',
        data: Retriever,
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

  @Get('/id/:_id')
  async getRetrieverById(@Param() { _id }: Pick<Retrievers, '_id'>) {
    try {
      const Retriever = await this.retrieversService.getRetrieverById(
        _id.toString(),
      );
      return {
        status: 'success',
        message: 'Retriever found',
        data: Retriever,
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

  @Post('/update/address/:_id')
  async updateRetrieverAddress(
    @Param() param: Pick<Retrievers, '_id'>,
    @Body() payload: Address,
  ): Promise<ReturnType<Retrievers>> {
    const res = await this.retrieversService.updateRetrieverAddress(
      payload,
      param._id.toString(),
    );
    if (res) {
      return {
        status: 'success',
        message: 'Address Updated successfull',
        error: false,
      };
    } else {
      return {
        status: 'failed',
        message: 'Incorrect user id',
        error: true,
      };
    }
  }

  @Get('/verify/email/:token')
  async verifyEmail(
    @Param() { token }: Pick<Retrievers, 'token'>,
  ): Promise<ReturnType<Retrievers>> {
    const res = this.retrieversService.verifyEmail(token);
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

  @Get('/request-password-reset/:email')
  async requestPasswordResetEmail(
    @Param() param: Pick<Retrievers, 'email'>,
  ): Promise<ReturnType<any>> {
    try {
      const retriever = await this.retrieversService.getRetrieverByEmail(
        param.email,
      );
      const code = await this.retrieversService.generatePasswordResetToken(
        retriever._id.toString(),
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
        message: 'Email not found!',
        status: 'failed',
        error: true,
      };
    }
  }

  @Get('/send-email-verification/:email')
  async sendEmailVerificationEmail(
    @Param() { email }: Pick<Retrievers, 'email'>,
  ): Promise<ReturnType<any>> {
    try {
      type emailJWTData = [string, Retrievers];

      const [token, retriever] = (await this.retrieversService.generateEmailJWT(
        email,
      )) as emailJWTData;
      const url = `https://api.mytonarizeng.com/retrivers/verify/email/${token}`;
      const html = generateVerifyEmailTemplate({
        name: retriever.fullName,
        url,
      });
      const res = await this.emailService.sendMessage({
        to: retriever.email,
        from: 'support@trixswap.com',
        subject: 'Verify Your Account',
        html,
      });
      console.log(res);
      return {
        status: 'success',
        message: 'Email verification sent',
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
