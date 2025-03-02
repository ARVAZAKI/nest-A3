import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './food.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Food])
  ],
  providers: [FoodService],
  controllers: [FoodController]
})
export class FoodModule {}
