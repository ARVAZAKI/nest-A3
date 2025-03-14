import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // Import dari package yang benar
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './program.entity';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([Program]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Sesuaikan dengan konfigurasi Redis Anda
      port: 6379,
      ttl: 60, // Waktu kedaluwarsa cache dalam detik
    }),
  ],
  providers: [ProgramService],
  controllers: [ProgramController],
})
export class ProgramModule {}