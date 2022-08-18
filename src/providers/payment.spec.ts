import { Test, TestingModule } from '@nestjs/testing';
import { Payment } from './payment';

describe('Payment', () => {
  let provider: Payment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Payment],
    }).compile();

    provider = module.get<Payment>(Payment);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
