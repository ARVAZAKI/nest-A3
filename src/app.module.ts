import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FoodModule } from './food/food.module';
import { ExerciseModule } from './exercise/exercise.module';
import { ProgramModule } from './program/program.module';
import { HistoryModule } from './history/history.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Membuat ConfigModule tersedia secara global
      envFilePath: '.env', // Menentukan lokasi file .env
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // Baca dari environment variable
        port: configService.get<number>('DB_PORT'), // Baca dari environment variable
        username: configService.get<string>('DB_USERNAME'), // Baca dari environment variable
        password: configService.get<string>('DB_PASSWORD'), // Baca dari environment variable
        database: configService.get<string>('DB_DATABASE'), // Baca dari environment variable
        autoLoadEntities: true, // Memuat entitas secara otomatis
        synchronize: true, // Hanya untuk development
      }),
    }),

    UserModule,
    FoodModule,
    ExerciseModule,
    ProgramModule,
    HistoryModule,
    GoalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}