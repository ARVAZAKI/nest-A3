import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { Program } from '../program/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Program])],
  providers: [ExerciseService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
