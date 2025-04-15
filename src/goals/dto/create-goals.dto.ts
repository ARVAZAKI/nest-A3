import { IsInt, IsNotEmpty } from "class-validator";

export class CreateGoalsDTO {
    @IsNotEmpty()
    @IsInt()
    weekly_workout: number;
}