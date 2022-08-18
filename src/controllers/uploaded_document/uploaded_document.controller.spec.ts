import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDocumentController } from './uploaded_document.controller';

describe('UploadedDocumentController', () => {
  let controller: UploadedDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedDocumentController],
    }).compile();

    controller = module.get<UploadedDocumentController>(
      UploadedDocumentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
