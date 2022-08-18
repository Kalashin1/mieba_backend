import { Module } from '@nestjs/common';
import { UploadersController } from 'src/controllers/uploaders/uploaders.controller';
import { UploadersSchema, Uploaders } from 'src/schemas/uploaders';
import { Uploaders as _UploaderService } from 'src/providers/uploaders';
import { MongooseModule } from '@nestjs/mongoose';
import { Email as EmailService } from 'src/providers/email';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Uploaders.name, schema: UploadersSchema },
    ]),
  ],
  providers: [_UploaderService, EmailService],
  controllers: [UploadersController],
})
export class UploadersModule {}
