import { IsNotEmpty } from "class-validator"

export class createDonationDTO{
      @IsNotEmpty()
      food_name: string

      @IsNotEmpty()
      food_category: string

      @IsNotEmpty()
      food_image: string

      @IsNotEmpty()
      food_description: string
}