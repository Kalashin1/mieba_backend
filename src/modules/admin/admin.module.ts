import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from 'src/controllers/admin/admin.controller';
import { Admin as AdminService } from 'src/providers/admin';
import { AdminSchema, Admin } from 'src/schemas/admin.schema';
import { UploadersSchema, Uploaders } from 'src/schemas/uploaders';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Uploaders.name, schema: UploadersSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
