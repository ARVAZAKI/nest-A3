import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDTO } from './dto/create-exercise.dto';
import { Program } from 'src/program/program.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Program)
    private programRepository: Repository<Program>,  ) {}

  async create(createExerciseDto: CreateExerciseDTO): Promise<Exercise> {
    const { program_id, ...exerciseData } = createExerciseDto;
    const program = await this.programRepository.findOne({ where: { id: program_id } });

    if (!program) {
      throw new NotFoundException(`Program with ID ${program_id} not found`);
    }
    const exercise = this.exerciseRepository.create({
      ...exerciseData,
      program,
    });

    return await this.exerciseRepository.save(exercise);
  }

  async findAll(): Promise<Exercise[]> {
    return await this.exerciseRepository.find();
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
    return exercise;
  }

  async remove(id: number): Promise<void> {
    const result = await this.exerciseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
  }
}
