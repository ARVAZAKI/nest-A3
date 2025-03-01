import { Module } from '@nestjs/common';
import { WorkoutResultService } from './workout-result.service';
import { WorkoutResultController } from './workout-result.controller';

@Module({
  providers: [WorkoutResultService],
  controllers: [WorkoutResultController]
})
export class WorkoutResultModule {}
