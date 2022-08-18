import { Test, TestingModule } from '@nestjs/testing';
import { Uploaders } from './uploaders';

describe('Uploaders', () => {
  let provider: Uploaders;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Uploaders],
    }).compile();

    provider = module.get<Uploaders>(Uploaders);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
