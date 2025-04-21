import { IsDate, IsInt, IsNotEmpty } from "class-validator";

export class CreateHistoryDTO {
    @IsNotEmpty()
    @IsInt()
    program_id: number;

    @IsNotEmpty()
    @IsInt()
    total_duration: number;
}
