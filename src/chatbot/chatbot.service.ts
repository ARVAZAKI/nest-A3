// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { HfInference } from '@huggingface/inference';
// import { Program } from 'src/program/program.entity';
// import { Exercise } from 'src/exercise/exercise.entity';

// @Injectable()
// export class ChatbotService {
//   private hf: HfInference;

//   constructor(
//     @InjectRepository(Program) private programRepo: Repository<Program>,
//     @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
//   ) {
//     this.hf = new HfInference('your_huggingface_api_key');
//   }

//   async getAnswer(question: string): Promise<string> {
//     const questionEmbedding = await this.hf.featureExtraction({
//       model: 'sentence-transformers/all-MiniLM-L6-v2',
//       inputs: question,
//     });

//     const similarPrograms = await this.programRepo.query(
//       `SELECT * FROM program ORDER BY embedding <-> $1 LIMIT 5`,
//       [questionEmbedding],
//     );

//     const similarExercises = await this.exerciseRepo.query(
//       `SELECT * FROM exercise ORDER BY embedding <-> $1 LIMIT 5`,
//       [questionEmbedding],
//     );

//     const context = [
//       ...similarPrograms.map(item => `Makanan: ${item.name} - ${item.description}`),
//       ...similarExercises.map(item => `Latihan: ${item.name} - ${item.description}`),
//     ].join('\n');

//     const response = await this.hf.textGeneration({
//       model: 'deepseek-ai/deepseek-r1-distill-qwen-7b',
//       prompt: `Berdasarkan informasi:\n${context}\n\nPertanyaan: ${question}\nJawaban:`,
//       max_length: 200,
//     });

//     return response.generated_text;
//   }
// }