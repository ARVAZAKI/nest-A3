import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { CreateExerciseDTO } from './dto/create-exercise.dto';
import { Program } from '../program/program.entity';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class ExerciseService {
  private hf: HfInference;

  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {
    this.hf = new HfInference(process.env.HUGGING_FACE_API_KEY); // Replace with your API key
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

    // Generate and save the embedding for the new exercise
    await this.generateEmbedding(savedExercise.id);

    return savedExercise;
  }

  // Method to generate embedding for an exercise
  async generateEmbedding(exerciseId: number): Promise<void> {
    const exercise = await this.exerciseRepository.findOneBy({ id: exerciseId });
    if (!exercise) throw new NotFoundException(`Exercise with id ${exerciseId} not found`);
  
    const text = `${exercise.exercise_name} ${exercise.exercise_description}`;
  
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
    await this.exerciseRepository.query(
      'UPDATE exercise SET embedding = $1::vector WHERE id = $2',
      [formattedVector, exerciseId]
    );
  }
  
  

  // Method to generate embeddings for all existing exercises
  async generateAllEmbeddings(): Promise<void> {
    const exercises = await this.exerciseRepository.find();
    for (const exercise of exercises) {
      await this.generateEmbedding(exercise.id);
    }
  }

  async findAll(): Promise<Exercise[]> {
    const data = await this.exerciseRepository.find();
    return data;
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