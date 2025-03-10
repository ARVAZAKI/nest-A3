import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program])],
  providers: [ProgramService],
  controllers: [ProgramController]
})
export class ProgramModule {}