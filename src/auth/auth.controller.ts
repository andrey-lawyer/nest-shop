import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Request,
  Delete,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    const message = await this.authService.create(registerDto);
    return message;
  }

  @Get('confirm-email/:token')
  async confirmEmail(
    @Param('token') token: string,
  ): Promise<{ message: string }> {
    const message = await this.authService.confirmEmail(token);
    return message;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const message = await this.authService.deleteUser(id);
    return message;
  }

  @Patch('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ): Promise<void> {
    console.log(password);
    const message = await this.authService.resetPassword(token, password);
    return message;
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    const message = await this.authService.requestPasswordReset(email);
    return message;
  }
}
