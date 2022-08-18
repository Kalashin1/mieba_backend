import { Controller } from '@nestjs/common';
import { Admin as AdminInterface } from 'src/interface/admin.interface';
import { Admin as AdminService } from 'src/providers/admin';
import { Get, Post, Body, Param } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/login')
  async login(@Body() payload: AdminInterface) {
    const admin = await this.adminService.loginAdmin(payload);
    return admin;
  }

  @Post('/signup')
  async signup(@Body() payload: AdminInterface) {
    const admin = await this.adminService.createAdmin(payload);
    return admin;
  }

  @Get('/token/:token')
  async getToken(@Param() { token }: any) {
    return this.adminService.getAdminByToken(token);
  }
}
