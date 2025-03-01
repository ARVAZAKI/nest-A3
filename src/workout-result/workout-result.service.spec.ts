import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutResultService } from './workout-result.service';

describe('WorkoutResultService', () => {
  let service: WorkoutResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutResultService],
    }).compile();

    service = module.get<WorkoutResultService>(WorkoutResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
