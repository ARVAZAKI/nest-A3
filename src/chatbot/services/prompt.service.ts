import { Injectable } from '@nestjs/common';
import { PromptTemplate } from '@langchain/core/prompts';

/**
 * PromptService yang lebih fleksibel dengan parameter bawaan,
 * tanpa mengubah struktur program asli.
 */
@Injectable()
export class PromptService {
  // Konfigurasi default yang mudah diubah
  private readonly persona = 'asisten olahraga';
  private readonly appName = 'Woreps';
  private readonly domainInfo = 'latihan dan program kebugaran';
  private readonly tone = 'jelas dan ringkas';
  private readonly language = 'Indonesia';

  private template = PromptTemplate.fromTemplate(
    `Anda adalah ${this.persona} dari aplikasi ${this.appName} yang membantu pengguna dengan informasi tentang ${this.domainInfo}.
Tolong jawab dengan ${this.tone} dan dalam bahasa ${this.language}.
Jika konteks tidak cukup, berikan jawaban umum yang relevan.

Konteks: {context}

Pertanyaan: {question}

Jawaban:`
  );

  /**
   * Membangun prompt berdasarkan konteks dan pertanyaan.
   * Struktur dan signature method tidak berubah.
   */
  async buildPrompt(context: string, question: string): Promise<string> {
    const ctx = context?.trim() ? context : 'Tidak ada konteks tersedia';
    return this.template.format({ context: ctx, question });
  }
}
