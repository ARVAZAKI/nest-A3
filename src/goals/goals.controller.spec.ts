// goals.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { CreateGoalsDTO } from './dto/create-goals.dto';

describe('GoalsController', () => {
  let controller: GoalsController;
  let service: GoalsService;

  const mockGoalsService = {
    create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn(() => Promise.resolve([{ id: 1, weekly_workout: 3 }])),
    findOneByUserId: jest.fn(() => Promise.resolve([{ id: 1, weekly_workout: 3 }])),
    update: jest.fn((dto, id) => Promise.resolve({ id, ...dto })),
    delete: jest.fn((id) => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [
        {
          provide: GoalsService,
          useValue: mockGoalsService,
        },
      ],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
    service = module.get<GoalsService>(GoalsService);
  });

  describe('create', () => {
    it('should create a goal', async () => {
      const dto: CreateGoalsDTO = { weekly_workout: 3 };
      // Simulasikan request dengan user id
      const req = { user: { id: 1 } };
      const result = await controller.create(dto, req);
      expect(result).toEqual({
        message: 'Goal created successfully',
        data: { id: 1, weekly_workout: 3 },
      });
      expect(service.create).toBeCalledWith(dto, 1);
    });
  });

  describe('findAll', () => {
    it('should return all goals', async () => {
      const result = await controller.findAll();
      expect(result).toEqual({
        message: 'Goal retrieved successfully',
        data: [{ id: 1, weekly_workout: 3 }],
      });
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOneByUserId', () => {
    it('should return goal for the logged-in user', async () => {
      const req = { user: { id: 1 } };
      const result = await controller.findOneByUserId(req);
      expect(result).toEqual({
        message: 'Goal retrieved successfully',
        data: [{ id: 1, weekly_workout: 3 }],
      });
      expect(service.findOneByUserId).toBeCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a goal', async () => {
      const dto: CreateGoalsDTO = { weekly_workout: 5 };
      const paramId = '1';
      const result = await controller.update(dto, paramId);
      expect(result).toEqual({
        message: 'Goal updated successfully',
        data: { id: 1, weekly_workout: 5 },
      });
      expect(service.update).toBeCalledWith(dto, 1);
    });
  });

  describe('delete', () => {
    it('should delete a goal', async () => {
      const paramId = '1';
      const result = await controller.delete(paramId);
      expect(result).toEqual({
        message: 'Goal deleted successfully',
      });
      expect(service.delete).toBeCalledWith(1);
    });
  });
});
