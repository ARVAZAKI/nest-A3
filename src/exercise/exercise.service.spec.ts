// exercise.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDTO } from './dto/create-exercise.dto';
import { UpdateExerciseDTO } from './dto/update-exercise.dto';

describe('ExerciseService', () => {
  let service: ExerciseService;
  const mockExerciseRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseService,
        {
          provide: getRepositoryToken(Exercise),
          useValue: mockExerciseRepository,
        },
      ],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new exercise', async () => {
      const createDto: CreateExerciseDTO = {
        exercise_name: 'Push Up',
        exercise_description: 'Basic exercise',
        exercise_asset: 'image.jpg',
        exercise_category: 'Bodyweight',
        exercise_muscle_category: 'Chest'
      };
      
      mockExerciseRepository.save.mockResolvedValue({ id: 1, ...createDto });
      const result = await service.create(createDto);
      
      expect(result).toEqual({ id: 1, ...createDto });
      expect(mockExerciseRepository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return array of exercises', async () => {
      const exercises = [{
        id: 1,
        exercise_name: 'Push Up',
        exercise_description: 'Basic exercise',
        exercise_asset: 'image.jpg',
        exercise_category: 'Bodyweight',
        exercise_muscle_category: 'Chest'
      }];
      
      mockExerciseRepository.find.mockResolvedValue(exercises);
      const result = await service.findAll();
      
      expect(result).toEqual(exercises);
      expect(mockExerciseRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an exercise', async () => {
      const updateDto: UpdateExerciseDTO = { exercise_description: 'Updated description' };
      const updatedExercise = { id: 1, ...updateDto };
      
      mockExerciseRepository.update.mockResolvedValue({ affected: 1 });
      mockExerciseRepository.findOneBy.mockResolvedValue(updatedExercise);
      
      const result = await service.update(1, updateDto);
      
      expect(result).toEqual(updatedExercise);
      expect(mockExerciseRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete an exercise', async () => {
      mockExerciseRepository.delete.mockResolvedValue({ affected: 1 });
      
      await service.remove(1);
      expect(mockExerciseRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});