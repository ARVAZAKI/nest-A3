import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Program } from '../program/program.entity';
import { History } from './history.entity';
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

        const history = this.historyRepository.create({user: user, program: program, total_duration: CreateHistoryDto.total_duration});

        return await this.historyRepository.save(history);
    }

    async findAll(): Promise<History[]> {
        const data =  await this.historyRepository.find({
          relations: ['user', 'program'],
        });

        return data;
      }

      async findByUserId(user_id: number): Promise<any> {
        const history = await this.historyRepository.find({
          where: { user: { id: user_id } },
          relations: ['user', 'program', 'program.exercises'],
        });
    
        const jumlah_program = history.length;
        const total_kalori = history.reduce((acc, curr) => acc + curr.program.calorie, 0);
        const sum_of_total_duration = history.reduce((acc, cur) => acc + (cur.total_duration || 0), 0);

        // Kembalikan data mentah, interceptor akan membungkusnya
        return { jumlah_program, total_kalori, sum_of_total_duration, history };
      }                
}
