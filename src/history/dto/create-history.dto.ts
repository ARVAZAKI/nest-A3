import { IsDate, IsInt, IsNotEmpty } from "class-validator";

export class CreateHistoryDTO {
    @IsNotEmpty()
    @IsInt()
    program_id: number;

    @IsNotEmpty()
    @IsInt()
    total_Duration: number;

    @IsNotEmpty()
    @IsDate()
    date: Date;
}
