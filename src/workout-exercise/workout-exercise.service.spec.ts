import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutExerciseService } from './workout-exercise.service';

describe('WorkoutExerciseService', () => {
  let service: WorkoutExerciseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutExerciseService],
    }).compile();

    service = module.get<WorkoutExerciseService>(WorkoutExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
