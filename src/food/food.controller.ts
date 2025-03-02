import { Controller, Get, HttpException, Post, Put, Param, NotFoundException, HttpStatus } from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('api/food')
export class FoodController {
      constructor(private service: FoodService) {}
      
      @Get('/')
      async getAllFoods() {
            try {
                  const food = await this.service.getAllFoods();
                  return {
                        message: 'get all food successfully',
                        data: food
                  }
            } catch (error) {
                  throw error
            }
      }  

      @Get('/bulking')
      async getBulkingFood() {
            try {
                  const food = await this.service.getBulkingFood();
                  return {
                        message: 'get bulking food successfully',
                        data: food
                  }
            } catch (error) {
                  throw error
            }
      }

      @Get('/diet')
      async getDietFood() {
            try {
                  const food = await this.service.getDietFood();
                  return {
                        message: 'get diet food successfully',
                        data: food
                  }
            } catch (error) {
                  throw error
            }
      }

      @Get('/:id')
      async getFoodById(@Param('id') id: string) {
          try {
            const food = await this.service.getFoodById(Number(id));  
            return {
              message: 'get food successfully',
              data: food
            }
          } catch (error) {
            throw error
      }
      }

      @Post('/')
      async createFood() {}

      @Put('/:id')
      async editFood(){}
}
