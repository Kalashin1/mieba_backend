import { Payment as PaymentService } from 'src/providers/payment';
import { Payment as PaymentInterface } from 'src/interface/payment.interface';
import { InvoiceDocument } from 'src/schemas/Payment.schema';
import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/recurring-payment')
  async createRecurringPayment(
    @Body() payload: PaymentInterface,
  ): Promise<InvoiceDocument> {
    return await this.paymentService.createIvoiceForRecurringPayment(payload);
  }

  @Post()
  async createInvoiceForOneTimePayment(
    @Body() payload: PaymentInterface,
  ): Promise<InvoiceDocument> {
    return await this.paymentService.createInvoiceForOneTimePayment(payload);
  }

  @Get('/invoice/get/:id')
  async getInvoice(@Param() payload: { id: string }): Promise<InvoiceDocument> {
    return await this.paymentService.getTransactionById(payload.id);
  }

  @Get('/invoice/verify/:reference')
  async verifyInvoice(
    @Param() payload: { reference: string },
  ): Promise<InvoiceDocument> {
    const transaction = await this.paymentService.VerifyTransaction(
      payload.reference,
    );
    if (!transaction.status) {
      throw Error('something happened!');
    }
    const { status, reference } = transaction.data.data;
    console.log(status);
    await this.paymentService.updateInvoiceStatusByReferece(reference, status);
    const invoice = await this.paymentService.getTransactionByReference(
      payload.reference,
    );
    return invoice;
  }
}
