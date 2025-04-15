import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {Goals} from 'src/goals/goals.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { CreateGoalsDTO } from './dto/create-goals.dto';

@Injectable()
export class GoalsService {
    constructor(
        @InjectRepository(Goals)
        private goalsRepository: Repository<Goals>,
        @InjectRepository(User)
        private userRepository:  Repository<User>
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
