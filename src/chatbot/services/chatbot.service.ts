import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { RetrievalService } from './retrieval.service';
import { PromptService } from './prompt.service';
import { LLMService } from './llm.service';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    private embeddingSvc: EmbeddingService,
    private retrievalSvc: RetrievalService,
    private promptSvc: PromptService,
    private llmSvc: LLMService,
  ) {}

  async getAnswer(question: string): Promise<string> {
    if (!question?.trim()) {
      return 'Pertanyaan tidak boleh kosong. Silakan ajukan pertanyaan yang valid!';
    }

    try {
      const embed = await this.embeddingSvc.getEmbedding(question);
      const items = question.toLowerCase().includes('latihan')
        ? await this.retrievalSvc.getSimilarExercises(embed)
        : await this.retrievalSvc.getSimilarPrograms(embed);

      const context = items.length
        ? items.map(i => `${i.name} - ${i.description}`).join('\n')
        : 'Tidak ada informasi latihan atau program yang relevan ditemukan.';
      this.logger.log(`Context: ${context}`);

      const prompt = await this.promptSvc.buildPrompt(context, question);
      return await this.llmSvc.generateText(prompt);
    } catch (err) {
      this.logger.error('Error processing question', err);
      return 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda.';
    }
  }
}