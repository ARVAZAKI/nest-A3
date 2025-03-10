import { IsNotEmpty } from "class-validator";

export class CreateProgramDTO {
  @IsNotEmpty()
  program_name: string;

  @IsNotEmpty()
  program_description: string;

  @IsNotEmpty()
  program_image: string;

  @IsNotEmpty()
  calorie: number;
  
}