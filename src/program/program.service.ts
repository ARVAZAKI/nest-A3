import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // Perbaikan import
import { Program } from './program.entity';
import { CreateProgramDTO } from './dto/create-program.dto';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class ProgramService {
  private hf: HfInference;

  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @Inject(CACHE_MANAGER) // Gunakan CACHE_MANAGER yang benar
    private readonly cacheManager: Cache,
  ) {
    this.hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
  }

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
    const savedProgram =  await this.programRepository.save(program);
    await this.generateEmbedding(savedProgram.id);
    return savedProgram;
  }

  // Method to generate embedding for an exercise
  async generateEmbedding(programId: number): Promise<void> {
    const program = await this.programRepository.findOneBy({ id: programId });
    if (!program) throw new NotFoundException(`Program with id ${programId} not found`);
  
    const text = `${program.program_name} ${program.program_description}`;
  
    // Dapatkan raw vector dari HuggingFace API
    const rawOutput = await this.hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });
  
    // Convert ke array biasa jika bukan array biasa
    const vector = Array.from((rawOutput as number[] | Float32Array));
  
    // Format sesuai kebutuhan pgvector: [1.0, 2.0, ...]
    const formattedVector = `[${vector.join(',')}]`;
  
    // Update pakai raw SQL dengan type cast ke vector
    await this.programRepository.query(
      'UPDATE program SET embedding = $1::vector WHERE id = $2',
      [formattedVector, programId]
    );
  }
  
  

  // Method to generate embeddings for all existing exercises
  async generateAllEmbeddings(): Promise<void> {
    const programs = await this.programRepository.find();
    for (const program of programs) {
      await this.generateEmbedding(program.id);
    }
  }

  // ✅ Delete a program
  async deleteProgram(id: number): Promise<void> {
    const result = await this.programRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
  }
}