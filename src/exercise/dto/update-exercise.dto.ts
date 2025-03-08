// dto/update-exercise.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDTO } from './create-exercise.dto';

export class UpdateExerciseDTO extends PartialType(CreateExerciseDTO) {}