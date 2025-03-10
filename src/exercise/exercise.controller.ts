import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDTO } from './dto/create-exercise.dto';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExerciseDto: CreateExerciseDTO) {
    const exercise = await this.exerciseService.create(createExerciseDto);
    return {
      message: 'Exercise created successfully',
      data: exercise,
    };
  }

  @Get('/')
  async findAll() {
    const exercises = await this.exerciseService.findAll();
    return {
      message: 'Exercises retrieved successfully',
      data: exercises,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const exercise = await this.exerciseService.findOne(+id);
    return {
      message: 'Exercise retrieved successfully',
      data: exercise,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.exerciseService.remove(+id);
  }
}
