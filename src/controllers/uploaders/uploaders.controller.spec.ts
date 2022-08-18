import { Test, TestingModule } from '@nestjs/testing';
import { UploadersController } from './uploaders.controller';

describe('UploadersController', () => {
  let controller: UploadersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadersController],
    }).compile();

    controller = module.get<UploadersController>(UploadersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
