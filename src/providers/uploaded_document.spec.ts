import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDocument } from './uploaded_document';

describe('UploadedDocument', () => {
  let provider: UploadedDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadedDocument],
    }).compile();

    provider = module.get<UploadedDocument>(UploadedDocument);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
