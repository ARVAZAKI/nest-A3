import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../program/program.entity';
import { Exercise } from '../exercise/exercise.entity';
import { GeminiClientProvider } from './providers/gemini-client.provider';
import { EmbeddingService } from './services/embedding.service';
import { RetrievalService } from './services/retrieval.service';
import { PromptService } from './services/prompt.service';
import { LLMService } from './services/llm.service';
import { ChatbotService } from './services/chatbot.service';
import { ChatbotController } from './chatbot.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ ttl: 3600, isGlobal: true }),
    TypeOrmModule.forFeature([Program, Exercise]),
  ],
  controllers: [ChatbotController],
  providers: [
    GeminiClientProvider,
    EmbeddingService,
    RetrievalService,
    PromptService,
    LLMService,
    ChatbotService,
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}