import { Test, TestingModule } from '@nestjs/testing';
import { Admin } from './admin';

describe('Admin', () => {
  let provider: Admin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Admin],
    }).compile();

    provider = module.get<Admin>(Admin);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
