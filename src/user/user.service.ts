import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,

  ) {}

  // REGISTER
  async register(): Promise<{ user: User; token: string }> {
    const userCount = await this.userRepository.count();
    const name = `woreps ${userCount + 1}`;
    const email = `woreps${userCount + 1}@gmail.com`;
    const password = faker.internet.password();
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    
    // Perbaikan: Menggunakan 'sub' untuk menyimpan ID user sesuai dengan standar JWT
    // dan memastikan payload konsisten dengan yang diharapkan oleh JwtStrategy
    const token = this.jwtService.sign(
      { sub: savedUser.id, email: savedUser.email },
      { expiresIn: '30d' } // Token berlaku selama 30 hari
    );
    return { user: savedUser, token };
  }

  // VALIDASI USER UNTUK LOGIN
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // TEMUKAN USER BERDASARKAN ID
  async findOneById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        message: 'Failed to get user',
        error: error.error,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // UPDATE PASSWORD
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }
}
