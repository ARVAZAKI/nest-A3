import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDTO } from './dto/create-program.dto';

@Controller('/api/programs')
export class ProgramController {
      constructor(private service: ProgramService) {}

      @Get('/')
      async getAllPrograms() {
            const data = await this.service.getAllPrograms();
            return {
                  message: "Programs retrieved successfully",
                  data: data
            }
      }

      @Get('/:id')
      async getProgramById(@Param('id') id: string) {
            const data = await this.service.getProgramById(Number(id));
            return {
                  message: "Program retrieved successfully",
                  data: data
            }
      }
      @Post('/')
      async createProgram(@Body() createProgramDto: CreateProgramDTO) {
      const data = await this.service.createProgram(createProgramDto);
      return {
            message: "Program created successfully",
            data: data
      };
      }      
      
      @Delete('/:id')
      async deleteProgram(@Param('id') id: string) {
            await this.service.deleteProgram(Number(id));
            return {
                  message: "Program deleted successfully"
            }
      }

      @Post('/generate-all-embeddings')
        @HttpCode(HttpStatus.OK)
        async generateAllEmbeddings() {
          await this.service.generateAllEmbeddings();
          return {
            message: 'All embeddings have been generated successfully',
          };
        }
}
