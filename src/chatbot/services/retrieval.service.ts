import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as pgvector from 'pgvector';
import { Exercise } from 'src/exercise/exercise.entity';
import { Program } from 'src/program/program.entity';

@Injectable()
export class RetrievalService {
  private readonly logger = new Logger(RetrievalService.name);

  constructor(private dataSource: DataSource) {}

  async getSimilarExercises(embedding: number[]): Promise<Exercise[]> {
    const sql = `
      SELECT id, exercise_name AS name, exercise_description AS description, exercise_category, repetisi
      FROM exercise
      WHERE exercise_name IS NOT NULL AND exercise_description IS NOT NULL
      ORDER BY embedding <-> $1
      LIMIT 10`;
    const vectorString = pgvector.toSql(embedding);
    const result = await this.dataSource.query(sql, [vectorString]);
    this.logger.log(`Retrieved exercises: ${JSON.stringify(result)}`);
    return result as Exercise[];
  }

  async getSimilarPrograms(embedding: number[]): Promise<Program[]> {
    const sql = `
      SELECT id, program_name AS name, program_description AS description, calorie
      FROM program
      WHERE program_name IS NOT NULL AND program_description IS NOT NULL
      ORDER BY embedding <-> $1
      LIMIT 3`;
    const vectorString = pgvector.toSql(embedding);
    const result = await this.dataSource.query(sql, [vectorString]);
    this.logger.log(`Retrieved programs: ${JSON.stringify(result)}`);
    return result as Program[];
  }
}