import { Module } from '@nestjs/common';
import { WorkoutExerciseService } from './workout-exercise.service';
import { WorkoutExerciseController } from './workout-exercise.controller';

@Module({
  providers: [WorkoutExerciseService],
  controllers: [WorkoutExerciseController]
})
export class WorkoutExerciseModule {}
