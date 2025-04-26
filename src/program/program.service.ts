import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Program } from './program.entity';
import { CreateProgramDTO } from './dto/create-program.dto';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ProgramService {
  private ai: GoogleGenAI;

  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async getAllPrograms(): Promise<Program[]> {
    const cacheKey = 'allPrograms';
    const cachedPrograms = await this.cacheManager.get<Program[]>(cacheKey);
    if (cachedPrograms) {
      return cachedPrograms;
    }

    const programs = await this.programRepository.find({ relations: ['exercises'] });
    await this.cacheManager.set(cacheKey, programs, 86400);

    return programs;
  }

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

  async createProgram(createProgramDto: CreateProgramDTO): Promise<Program> {
    const program = this.programRepository.create(createProgramDto);
    const savedProgram = await this.programRepository.save(program);
    await this.generateEmbedding(savedProgram.id);
    return savedProgram;
  }

  async generateEmbedding(programId: number): Promise<void> {
    const program = await this.programRepository.findOneBy({ id: programId });
    if (!program) throw new NotFoundException(`Program with id ${programId} not found`);

    const text = `${program.program_name} ${program.program_description}`;

    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-exp-03-07',
      contents: text,
      config: {
        taskType: 'SEMANTIC_SIMILARITY',
      },
    });

    const vector = response.embeddings?.[0]?.values ?? [];

    if (vector.length === 0) {
      throw new Error('Embedding vector is empty');
    }

    const formattedVector = `[${vector.join(',')}]`;

    await this.programRepository.query(
      'UPDATE program SET embedding = $1::vector WHERE id = $2',
      [formattedVector, programId],
    );
  }

  async generateAllEmbeddings(): Promise<void> {
    const programs = await this.programRepository.query(`
      SELECT * FROM program 
      WHERE embedding IS NULL 
      LIMIT 5
    `);
  
    for (const program of programs) {
      await this.generateEmbedding(program.id);
    }
  }

  async deleteProgram(id: number): Promise<void> {
    const result = await this.programRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
  }
}
