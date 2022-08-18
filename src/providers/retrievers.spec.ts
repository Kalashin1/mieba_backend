import { Test, TestingModule } from '@nestjs/testing';
import { Retrievers } from './retrievers';

describe('Retrievers', () => {
  let provider: Retrievers;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Retrievers],
    }).compile();

    provider = module.get<Retrievers>(Retrievers);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
