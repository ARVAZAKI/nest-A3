import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDTO } from './dto/create-history.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createHistoryDto: CreateHistoryDTO,@Req() req: any) {
        const userId = req.user.id || req.user.sub;
        const history = await this.historyService.create(createHistoryDto, userId);
        return {
            message: "History created successfully",
            data: history
        }
    }

    @Get('/')
    async findAll() {
        const historys = await this.historyService.findAll();
        return {
            message: "History retrieved successfully",
            data: historys
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async findOneByUserId(@Req() req: any) {
        const userId = req.user.id || req.user.sub;
        const history = await this.historyService.findOneByUserId(userId);
        return {
            message: "History retrieved successfully",
            data: history
        }
    }
}
