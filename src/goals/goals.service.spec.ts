// goals.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goals } from './goals.entity';
import { User } from 'src/user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateGoalsDTO } from './dto/create-goals.dto';

describe('GoalsService', () => {
  let service: GoalsService;
  let goalsRepository: any;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: getRepositoryToken(Goals),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
    goalsRepository = module.get(getRepositoryToken(Goals));
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a goal successfully', async () => {
      const createGoalsDto: CreateGoalsDTO = { weekly_workout: 3 };
      const userId = 1;
      const user = { id: userId };
      userRepository.findOne.mockResolvedValue(user);

      const goal = { id: 1, ...createGoalsDto, user };
      goalsRepository.create.mockReturnValue(goal);
      goalsRepository.save.mockResolvedValue(goal);

      const result = await service.create(createGoalsDto, userId);
      expect(result).toEqual(goal);
      expect(userRepository.findOne).toBeCalledWith({ where: { id: userId } });
      expect(goalsRepository.create).toBeCalledWith({ ...createGoalsDto, user });
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.create({ weekly_workout: 3 }, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of goals', async () => {
      const goals = [{ id: 1, weekly_workout: 3, user: {} }];
      goalsRepository.find.mockResolvedValue(goals);
      expect(await service.findAll()).toEqual(goals);
    });
  });

  describe('findOneByUserId', () => {
    it('should return goals by user id', async () => {
      const goals = [{ id: 1, weekly_workout: 3, user: { id: 1 } }];
      goalsRepository.find.mockResolvedValue(goals);
      const result = await service.findOneByUserId(1);
      expect(result).toEqual(goals);
      expect(goalsRepository.find).toBeCalledWith({
        where: { user: { id: 1 } },
        relations: ['user'],
      });
    });
  });

  describe('update', () => {
    it('should update goal successfully', async () => {
      const createGoalsDto: CreateGoalsDTO = { weekly_workout: 4 };
      const goalId = 1;
      const existingGoal = { id: 1, weekly_workout: 3 };
      goalsRepository.findOne.mockResolvedValue(existingGoal);
      
      // Mock implementasi merge untuk menggabungkan DTO ke entitas yang sudah ada
      goalsRepository.merge.mockImplementation((goal, dto) => Object.assign(goal, dto));
      const updatedGoal = { ...existingGoal, ...createGoalsDto };
      goalsRepository.save.mockResolvedValue(updatedGoal);

      const result = await service.update(createGoalsDto, goalId);
      expect(result).toEqual(updatedGoal);
      expect(goalsRepository.merge).toBeCalledWith(existingGoal, createGoalsDto);
    });

    it('should throw NotFoundException if goal is not found', async () => {
      goalsRepository.findOne.mockResolvedValue(null);
      await expect(service.update({ weekly_workout: 5 }, 99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete goal successfully', async () => {
      goalsRepository.delete.mockResolvedValue({ affected: 1 });
      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(goalsRepository.delete).toBeCalledWith(1);
    });

    it('should throw NotFoundException if no goal is affected', async () => {
      goalsRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
    });
  });
});
