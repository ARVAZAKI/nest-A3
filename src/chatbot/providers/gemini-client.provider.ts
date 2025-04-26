import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export const GeminiClientProvider: Provider = {
  provide: GoogleGenAI,
  useFactory: (config: ConfigService) => 
    new GoogleGenAI({ apiKey: config.get<string>('GEMINI_API_KEY') || '' }),
  inject: [ConfigService],
};