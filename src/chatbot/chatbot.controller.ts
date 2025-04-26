import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ChatbotService } from './services/chatbot.service';

@Controller('/api/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('ask')
  async ask(@Body('question') question: string) {
    if (!question) throw new BadRequestException('Pertanyaan harus disediakan.');
    return { answer: await this.chatbotService.getAnswer(question) };
  }
}