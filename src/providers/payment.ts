import { InvoiceDocument, Invoice } from './../schemas/Payment.schema';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  Payment as PaymentInterface,
  CreateTransactionPayload,
  VerifyTransactionPayload,
} from 'src/interface/payment.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type Authorization_Type = 'check_authorization' | 'charge_authorization';

@Injectable()
export class Payment {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument, Invoice>,
    private httpService: HttpService,
  ) {}

  private paystackTestAPIKEY =
    'sk_test_381ef0374e8abe15f538288775a89f7141719cbe';
  private paystackLiveAPIKEY =
    'sk_live_dd48967a7e720d3f8ebd1bbe43789e72e81168c7';

  async createIvoiceForRecurringPayment({
    amount,
    email,
    phoneNumber,
    plan,
  }: PaymentInterface): Promise<InvoiceDocument> {
    const transaction = await this.InitializeTransaction(email, amount, plan);
    if (transaction.status !== 200 || 201) {
      throw Error('something happened!');
    } else {
      const { authorization_url, reference } = transaction.data.data;
      return await this.invoiceModel.create({
        amount,
        email,
        phoneNumber,
        plan,
        reference,
        authorization_url,
      });
    }
  }

  async createInvoiceForOneTimePayment({
    amount,
    email,
    phoneNumber,
  }: Pick<
    PaymentInterface,
    'amount' | 'phoneNumber' | 'email'
  >): Promise<InvoiceDocument> {
    const transaction = await this.InitializeTransaction(email, amount);
    if (!transaction.status) {
      console.log(transaction.data);
      throw Error('Something Happened!');
    } else {
      const { authorization_url, reference } = transaction.data.data;
      console.log(transaction.data.data.authorization_url);
      return await this.invoiceModel.create({
        amount,
        email,
        phoneNumber,
        reference,
        authorization_url,
      });
    }
  }

  async getCustomerTransactions(email: string): Promise<InvoiceDocument[]> {
    return await this.invoiceModel.find({ email });
  }

  async getTransactionById(id: string): Promise<InvoiceDocument> {
    return await this.invoiceModel.findById(id);
  }

  async getTransactionByReference(reference: string): Promise<InvoiceDocument> {
    return await this.invoiceModel.findOne({ reference });
  }

  async updateInvoiceStatusByReferece(
    reference: string,
    status: string,
  ): Promise<void> {
    const invoice = await this.invoiceModel.findOne({ reference });
    await invoice.updateOne({ status });
  }

  InitializeTransaction(email: string, amount: number, _plan?: string) {
    return this.httpService
      .post<CreateTransactionPayload>(
        `https://api.paystack.co/transaction/initialize`,
        { email, amount: amount * 100 },
        {
          headers: {
            Authorization: `Bearer ${this.paystackTestAPIKEY}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .toPromise();
  }

  VerifyTransaction(reference: string) {
    return this.httpService
      .get<VerifyTransactionPayload>(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackTestAPIKEY}`,
          },
        },
      )
      .toPromise();
  }

  async chargeAuthorization(
    authorization_code: string,
    email: string,
    amount: number,
    type: Authorization_Type,
  ) {
    return this.httpService
      .post<VerifyTransactionPayload>(
        `https://api.paystack.com/transaction/${type}`,
        {
          email,
          amount,
          authorization_code,
        },
        {
          headers: {
            Authorization:
              'Bearer sk_live_dd48967a7e720d3f8ebd1bbe43789e72e81168c7',
          },
        },
      )
      .toPromise();
  }
}
