import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Program } from 'src/program/program.entity';
import { History } from 'src/history/history.entity';
import { CreateHistoryDTO } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History)
        private historyRepository: Repository<History>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Program)
        private programRepository: Repository<Program>,
    ) {}

    async create(CreateHistoryDto: CreateHistoryDTO, userId: number): Promise<History> {
        const {program_id} = CreateHistoryDto;
        const user = await this.userRepository.findOne({where: {id: userId}})
        if(!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        const program = await this.programRepository.findOne({where: {id: program_id}})
        if(!program) {
            throw new NotFoundException(`Program with ID ${program_id} not found`);
        }

        const history = this.historyRepository.create({user: user, program: program});

        return await this.historyRepository.save(history);
    }

    async findAll(): Promise<History[]> {
        return await this.historyRepository.find({
          relations: ['user', 'program'],
        });
      }

      async findOneByUserId(user_id: number): Promise<any> {
        const history = await this.historyRepository.find({
          where: { user: { id: user_id } },
          relations: ['user', 'program', 'program.exercises'],
        });
        
        if (!history || history.length === 0) {
          throw new NotFoundException(`User with ID ${user_id} not found`);
        }
      
        const jumlah_program = history.length;
        const total_kalori = history.reduce((acc, curr) => acc + curr.program.calorie, 0);
        let total_exercise_duration = 0;
        
        const program = history.map(item => {
          const prog = item.program;
          const total_duration_exercise = (prog.exercises || [])
            .reduce((acc, exercise) => acc + (exercise.duration || 0), 0);
          total_exercise_duration += total_duration_exercise;
          
          return {
            id: prog.id,
            program_image: prog.program_image,
            program_name: prog.program_name,
            program_description: prog.program_description,
            calorie: prog.calorie,
            total_duration_exercise
          };
        });
      
        // Kembalikan data mentah, interceptor akan membungkusnya
        return { jumlah_program, total_kalori, total_exercise_duration, program };
      }                
}
