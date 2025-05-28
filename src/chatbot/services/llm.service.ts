import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);

  constructor(
    private genAI: GoogleGenAI,
    private config: ConfigService,
  ) {}

  async generateText(inputs: string): Promise<string> {
    const modelName = this.config.get<string>('LLM_MODEL') || 'gemini-2.0-flash';
    this.logger.debug(`Generating text with model ${modelName}, prompt: ${inputs}`);

    try {
      // Menggunakan models.generateContent langsung sama seperti embedContent
      const result = await this.genAI.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: inputs }] }],
        config: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.9,
        }
      });

      // Mengecek apakah result ada
      if (!result) {
        throw new Error('Respons kosong dari Gemini API');
      }
      
      // Mengambil teks dari result
      const text = result.text;
      if (text === undefined || text === null) {
        throw new Error('Respons tidak berisi teks');
      }
      
      const finalText = text.trim();
      this.logger.debug(`Generated text: ${finalText}`);
      
      return finalText;
    } catch (error) {
      this.logger.error(`Error generating text: ${error.message}`);
      throw new Error(`Gagal menghasilkan teks: ${error.message}`);
    }
  }
}