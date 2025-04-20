import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import {Goals} from './goals.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { History } from '../history/history.entity';
import { CreateGoalsDTO } from './dto/create-goals.dto';
import { startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class GoalsService {
    constructor(
        @InjectRepository(Goals)
        private goalsRepository: Repository<Goals>,
        @InjectRepository(User)
        private userRepository:  Repository<User>,
        @InjectRepository(History)
        private historyRepository: Repository<History>
    ) {}

    async create(createGoalsDto: CreateGoalsDTO, userId: number): Promise<Goals> {
        const user = await this.userRepository.findOne({where: {id: userId}})
        if(!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const goal = this.goalsRepository.create({...createGoalsDto, user: user});
        return await this.goalsRepository.save(goal);
    }

    async findAll(): Promise<Goals[]> {
        const goals = await this.goalsRepository.find({relations: ['user']});
        return goals;
    }

    async findOneByUserId(user_id: number): Promise<any> {
        const goal = await this.goalsRepository.find({where: {user: {id: user_id}}, relations: ['user']});
        return goal;
    }

    async WeeklyGoalStatus(user_id: number): Promise<any> {
        const today = new Date();

        // Hitung awal dan akhir minggu ini
        const start = startOfWeek(today, {weekStartsOn: 1});
        const end = endOfWeek(today, {weekStartsOn: 1});

        // Ambil semua history dalam minggu ini
        const histories = await this.historyRepository.find({
            where: {
                user: { id: user_id },
                date: Between(start, end)
            },
            relations: ['user'],
        });

        const message = histories.length >= 3 ? "Kamu telah menyelesaikan olahraga minggu ini!" : "";

        return {
            olahraga_diselesaikan_dalam_seminggu: histories.length,
            message
        };
    }

    async update(createGoalsDto: CreateGoalsDTO, goalId: number): Promise<Goals> {
        const goal = await this.goalsRepository.findOne({where: {id: goalId}});

        if(!goal) {
            throw new NotFoundException(`Goal with ID ${goalId} not found`);
        }

        this.goalsRepository.merge(goal, createGoalsDto);
        return await this.goalsRepository.save(goal);
    }

    async delete(goalId: number): Promise<void> {
        const goal = await this.goalsRepository.delete(goalId);

        if(goal.affected === 0) {
            throw new NotFoundException(`Goal with ID ${goalId} not found`);
        }
    }
}
