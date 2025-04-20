import { Controller, HttpCode, HttpStatus, Post, UseGuards, Body, Req, Get, Put, Param, Delete } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateGoalsDTO } from './dto/create-goals.dto';

@Controller('/api/goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createGoalsDto: CreateGoalsDTO, @Req() req: any) {
        const userId = req.user.id || req.user.sub;
        const goal = await this.goalsService.create(createGoalsDto, userId);
        return {
            message: "Goal created successfully",
            data: goal
        }
    }

    @Get('/')
    async findAll() {
        const goals = await this.goalsService.findAll();
        return {
            message: "Goal retrieved successfully",
            data: goals
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async findOneByUserId(@Req() req: any) {
        const userId = req.user.id || req.user.sub;
        const goal = await this.goalsService.findOneByUserId(userId);
        return {
            message: "Goal retrieved successfully",
            data: goal
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me-status')
    async weeklyGoalStatus(@Req() req: any) {
        const userId = req.user.id || req.user.sub;
        const status = await this.goalsService.WeeklyGoalStatus(userId);
        return status;
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    async update(@Body() createGoalsDto: CreateGoalsDTO, @Param('id') goalId: string) {
        const goal = await this.goalsService.update(createGoalsDto, +goalId);
        return {
            message: "Goal updated successfully",
            data: goal
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    //@HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') goalId: string) {
        await this.goalsService.delete(+goalId);
        return {
            message: "Goal deleted successfully"
        }
    }
}
