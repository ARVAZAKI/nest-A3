import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDTO } from './dto/create-exercise.dto';
import { Program } from '../program/program.entity';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ExerciseService {
  private ai: GoogleGenAI;

  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

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

    const savedExercise = await this.exerciseRepository.save(exercise);

    await this.generateEmbedding(savedExercise.id);

    return savedExercise;
  }

  async generateEmbedding(exerciseId: number): Promise<void> {
    const exercise = await this.exerciseRepository.findOneBy({ id: exerciseId });
    if (!exercise) throw new NotFoundException(`Exercise with id ${exerciseId} not found`);

    const text = `${exercise.exercise_name} ${exercise.exercise_description}`;

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

    await this.exerciseRepository.query(
      'UPDATE exercise SET embedding = $1::vector WHERE id = $2',
      [formattedVector, exerciseId]
    );
  }

  async generateAllEmbeddings(): Promise<void> {
    const exercises = await this.exerciseRepository.query(`
      SELECT * FROM exercise 
      WHERE embedding IS NULL 
      LIMIT 5
    `);
  
    for (const exercise of exercises) {
      await this.generateEmbedding(exercise.id);
    }
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
