import { Controller, Post, Body, UnauthorizedException, UseGuards, Req, ForbiddenException, BadRequestException, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import * as crypto from 'crypto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Register new admin, super admin, or teacher (super admin only)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto, @Req() req) {
    // Only allow creation of ADMIN, SUPER_ADMIN, TEACHER
    if (
      registerDto.role !== Role.ADMIN &&
      registerDto.role !== Role.SUPER_ADMIN &&
      registerDto.role !== Role.TEACHER
    ) {
      throw new ForbiddenException('You can only register ADMIN, SUPER_ADMIN, or TEACHER roles here. Use /student for students.');
    }
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiResponse({ status: 200, description: 'Reset token generated (for testing, returned in response)' })
  async forgotPassword(@Body('email') email: string) {
    const token = await this.authService.generateResetToken(email);
    return { message: 'Reset token generated', token };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Password reset successful' };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update your own profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Req() req, @Body() body: { firstName?: string; lastName?: string; email?: string }) {
    const userId = req.user.userId;
    return this.authService.updateProfile(userId, body);
  }
} 