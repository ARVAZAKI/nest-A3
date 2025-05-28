import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import * as crypto from 'crypto';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(
    private genAI: GoogleGenAI,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private config: ConfigService,
  ) {}

  async getEmbedding(text: string): Promise<number[]> {
    if (!text?.trim()) {
      throw new Error('Teks tidak boleh kosong');
    }

    const key = crypto.createHash('md5').update(text).digest('hex');
    const cached = await this.cache.get<number[]>(key);
    if (cached) {
      this.logger.debug(`Menggunakan embedding dari cache untuk teks: ${text}`);
      return cached;
    }

    const modelName = this.config.get<string>('EMBEDDING_MODEL') || 'gemini-embedding-exp-03-07';

    try {
      const response = await this.genAI.models.embedContent({
        model: modelName,
        contents: text,
      });
      
      // Validasi response.embeddings dan ekstrak nilai embeddings dengan pengecekan null
      if (!response?.embeddings || !response.embeddings[0] || !response.embeddings[0].values) {
        throw new Error('Respons embedding tidak valid atau kosong');
      }
      
      const embedding = response.embeddings[0].values;

      if (!embedding || embedding.length === 0 || embedding.some(val => isNaN(val))) {
        throw new Error('Embedding berisi nilai tidak valid atau kosong');
      }

      this.logger.debug(`Embedding dihasilkan untuk teks: ${text}, panjang: ${embedding.length}`);
      await this.cache.set(key, embedding, 86400); // TTL 24 jam
      return embedding;
    } catch (error) {
      this.logger.error(`Error generating embedding: ${error.message}`);
      throw new Error(`Gagal membuat embedding: ${error.message}`);
    }
  }
}