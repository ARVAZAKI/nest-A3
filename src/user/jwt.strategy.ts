import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Ekstrak token dari header Authorization dengan format Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Gunakan secret key yang sama seperti yang didefinisikan di JwtModule (disarankan ambil dari env)
      secretOrKey: process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    // Payload akan berisi data yang kita sertakan saat generate token (misalnya { sub: user.id, email: user.email })
    // Metode ini dapat disesuaikan untuk mengembalikan objek user atau informasi lain
    return { ...payload };
  }
}
