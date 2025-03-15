import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // Perbaikan import
import { Program } from './program.entity';
import { CreateProgramDTO } from './dto/create-program.dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @Inject(CACHE_MANAGER) // Gunakan CACHE_MANAGER yang benar
    private readonly cacheManager: Cache,
  ) {}

  // ✅ Get all programs with Redis caching
  async getAllPrograms(): Promise<Program[]> {
    const cacheKey = 'allPrograms';
    // Periksa apakah data sudah ada di cache
    const cachedPrograms = await this.cacheManager.get<Program[]>(cacheKey);
    if (cachedPrograms) {
      return cachedPrograms;
    }

    // Jika belum ada di cache, ambil data dari database
    const programs = await this.programRepository.find({ relations: ['exercises'] });

    // Simpan data ke cache dengan TTL 60 detik
    await this.cacheManager.set(cacheKey, programs, 86400);

    return programs;
  }

  // ✅ Get program by ID with related exercises and error handling
  async getProgramById(id: number): Promise<Program> {
    const program = await this.programRepository.findOne({
      where: { id },
      relations: ['exercises'],
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  // ✅ Create a new program
  async createProgram(createProgramDto: CreateProgramDTO): Promise<Program> {
    const program = this.programRepository.create(createProgramDto);
    return await this.programRepository.save(program);
  }

  // ✅ Delete a program
  async deleteProgram(id: number): Promise<void> {
    const result = await this.programRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
  }
}