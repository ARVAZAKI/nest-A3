import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from './program.entity';
import { CreateProgramDTO } from './dto/create-program.dto';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  // ✅ Get all programs
  async getAllPrograms(): Promise<Program[]> {
    return this.programRepository.find({ relations: ['exercises'] });
  }

  // ✅ Get program by ID with related exercises and error handling
  async getProgramById(id: number): Promise<Program> {
    const program = await this.programRepository.findOne({
      where: { id },
      relations: ['exercises'], // Mengambil data exercise yang terkait
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
