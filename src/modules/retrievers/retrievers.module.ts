import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RetrieverSchema, Retrievers } from 'src/schemas/retrievers';
import { RetrieversController } from 'src/controllers/retrievers/retrievers.controller';
import { Retrievers as _RetrieversService } from 'src/providers/retrievers';
import { Email as EmailService } from 'src/providers/email';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Retrievers.name, schema: RetrieverSchema },
    ]),
  ],
  controllers: [RetrieversController],
  providers: [_RetrieversService, EmailService],
})
export class RetrieversModule {}
