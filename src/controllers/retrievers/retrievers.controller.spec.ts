import { Test, TestingModule } from '@nestjs/testing';
import { RetrieversController } from './retrievers.controller';

describe('RetrieversController', () => {
  let controller: RetrieversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetrieversController],
    }).compile();

    controller = module.get<RetrieversController>(RetrieversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
