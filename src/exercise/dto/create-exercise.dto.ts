import { IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateExerciseDTO {
  @IsNotEmpty()
  exercise_name: string;

  @IsNotEmpty()
  exercise_description: string;

  @IsNotEmpty()
  exercise_asset: string;

  @IsNotEmpty()
  exercise_category: string;

  @IsOptional() 
  @IsNumber()
  repetisi?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsNotEmpty()
  @IsInt()
  program_id: number;
}