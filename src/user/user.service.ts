import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // REGISTER
  async register(
    name: string,
    email: string,
    password: string,
    tinggi_badan: number,
    berat_badan: number,
    usia: number,
    jenis_kelamin: string,
    tujuan_workout: string,
  ): Promise<User> {
    // Cek apakah email sudah terdaftar
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      tinggi_badan,
      berat_badan,
      usia,
      jenis_kelamin,
      tujuan_workout,
    });

    return this.userRepository.save(newUser);
  }

  // VALIDASI USER UNTUK LOGIN
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    // Bandingkan password dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // TEMUKAN USER BERDASARKAN ID
  async findOneById(id: number): Promise<User> {
    try {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if(!user) {
            throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
        }
        return user;
    } catch (error) {
        if (error instanceof HttpException) {
            throw error;
      }
      throw new HttpException({
            message: 'Failed to get user',
            error: error.error
      }, HttpStatus.INTERNAL_SERVER_ERROR)
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
