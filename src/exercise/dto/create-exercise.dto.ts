import { IsNotEmpty } from "class-validator";

export class CreateExerciseDTO {
  @IsNotEmpty()
  exercise_name: string;

  @IsNotEmpty()
  exercise_description: string;

  @IsNotEmpty()
  exercise_asset: string;

  @IsNotEmpty()
  exercise_category: string;

  @IsNotEmpty()
  exercise_muscle_category: string;
}