import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Food } from './food.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FoodService {
      constructor(
            @InjectRepository(Food) private readonly foodRepository: Repository<Food>
      ){}

      async getAllFoods(): Promise<Food[]> {
            try {
                  return this.foodRepository.find();
            } catch (error) {
                  throw new HttpException({
                        message: 'Failed to get all foods',
                        error: error.error
                  }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
      }

      async getBulkingFood(): Promise<Food[]>{
            try {
                 return this.foodRepository.find({
                  where: {
                       food_category: 'bulking'
                  }
                 }); 
            } catch (error) {
                  throw new HttpException({
                        message: 'Failed to get bulking food',
                        error: error.error
                  }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
      }

      async getDietFood(): Promise<Food[]>{
            try {
                 return this.foodRepository.find({
                  where: {
                       food_category: 'diet'
                  }
                 }); 
            } catch (error) {
                  throw new HttpException({
                        message: 'Failed to get diet food',
                        error: error.error
                  }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
      }

      async getFoodById(id: number): Promise<Food> {
            try {
                  const food = await this.foodRepository.findOne({
                        where: {
                              id: id
                        }
                  });
                  if (!food) {
                        throw new HttpException('Food not found', HttpStatus.NOT_FOUND);
                    }
                    return food
            } catch (error) {
                  if (error instanceof HttpException) {
                        throw error;
                  }
                  throw new HttpException({
                        message: 'Failed to get food',
                        error: error.error
                  }, HttpStatus.INTERNAL_SERVER_ERROR)
            }
      }
}
