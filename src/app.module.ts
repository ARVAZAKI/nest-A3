import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FoodModule } from './food/food.module';
import { ExerciseModule } from './exercise/exercise.module';
import { ProgramModule } from './program/program.module';
import { WorkoutResultModule } from './workout-result/workout-result.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432, 
      username: 'postgres', 
      password: 'postgres', 
      database: 'woreps', 
      autoLoadEntities: true, // ✅ Sudah cukup, tidak perlu forFeature()
      synchronize: true,
    }),
    UserModule,
    FoodModule,
    ExerciseModule,
    ProgramModule,
    WorkoutResultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
