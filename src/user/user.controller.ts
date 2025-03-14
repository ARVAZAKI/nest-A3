import { Controller, Post, Body, Res, HttpStatus, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  @Post('register')
  async register(@Res() res: Response) {
    try {
      const user = await this.userService.register();
      return res.status(HttpStatus.CREATED).json({
        message: 'Registrasi berhasil',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  // LOGIN
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Email atau password salah.',
      });
    }

    // Buat payload untuk token
    const payload = { sub: user.id, email: user.email };
    // Generate JWT
    const token = this.jwtService.sign(payload);

    return res.status(HttpStatus.OK).json({
      message: 'Login berhasil',
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }

  // LOGOUT
  @Post('logout')
  async logout(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      message: 'Logout berhasil. Hapus token di sisi klien.',
    });
  }

  // RESET PASSWORD (userId diambil dari token)
  @UseGuards(AuthGuard('jwt'))
  @Post('reset-password')
  async resetPassword(
    @Req() req: any,
    @Body('newPassword') newPassword: string,
    @Res() res: Response,
  ) {
    try {
      // Data user dari token tersedia pada req.user (hasil dari validate di JwtStrategy)
      const user = req.user;
      const userId = user.id || user.sub;
      if (!userId) {
        throw new BadRequestException('Token tidak valid.');
      }

      await this.userService.updatePassword(userId, newPassword);
      return res.status(HttpStatus.OK).json({
        message: 'Password berhasil diubah',
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Terjadi kesalahan saat mengubah password',
      });
    }
  }
}
