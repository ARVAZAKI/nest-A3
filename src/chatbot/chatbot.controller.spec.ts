import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './services/chatbot.service';

describe('ChatbotController', () => {
  let controller: ChatbotController;
  let chatbotService: ChatbotService;

  const mockChatbotService = {
    getAnswer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotController],
      providers: [
        {
          provide: ChatbotService,
          useValue: mockChatbotService,
        },
      ],
    }).compile();

    controller = module.get<ChatbotController>(ChatbotController);
    chatbotService = module.get<ChatbotService>(ChatbotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ask', () => {
    it('should throw BadRequestException if question is not provided', async () => {
      await expect(controller.ask('' as any)).rejects.toThrow(BadRequestException);
      // TypeScript tidak mengizinkan null/undefined untuk parameter string
      // Gunakan type assertion untuk pengujian
      await expect(controller.ask(null as unknown as string)).rejects.toThrow(BadRequestException);
      await expect(controller.ask(undefined as unknown as string)).rejects.toThrow(BadRequestException);
    });

    it('should return answer for valid question', async () => {
      const question = 'Apa latihan terbaik untuk pemula?';
      const expectedAnswer = 'Untuk pemula, latihan yang direkomendasikan adalah...';
      
      mockChatbotService.getAnswer.mockResolvedValue(expectedAnswer);
      
      const result = await controller.ask(question);
      
      expect(chatbotService.getAnswer).toHaveBeenCalledWith(question);
      expect(result).toEqual({ answer: expectedAnswer });
    });

    it('should handle special characters and lengthy questions', async () => {
      const question = 'Apa latihan terbaik untuk pemula? '.repeat(50) + '!@#$%^&*()';
      const expectedAnswer = 'Untuk pemula, latihan yang direkomendasikan adalah...';
      
      mockChatbotService.getAnswer.mockResolvedValue(expectedAnswer);
      
      const result = await controller.ask(question);
      
      expect(chatbotService.getAnswer).toHaveBeenCalledWith(question);
      expect(result).toEqual({ answer: expectedAnswer });
    });

    it('should properly handle non-string question data types', async () => {
      // @ts-ignore - Forcing invalid input to test robustness
      await expect(controller.ask(123)).rejects.toThrow(BadRequestException);
      // @ts-ignore - Forcing invalid input to test robustness
      await expect(controller.ask({})).rejects.toThrow(BadRequestException);
      // @ts-ignore - Forcing invalid input to test robustness
      await expect(controller.ask([])).rejects.toThrow(BadRequestException);
    });

    it('should forward question to chatbotService and return result', async () => {
      const weirdQuestion = 'Bisakah kamu membantu <script>alert("XSS")</script> dengan latihan?';
      const expectedAnswer = 'Maaf, saya Asisten Woreps yang hanya dapat membantu Anda dengan informasi seputar latihan fisik dan kebugaran. Dapatkah saya membantu Anda menemukan program latihan yang sesuai?';
      
      mockChatbotService.getAnswer.mockResolvedValue(expectedAnswer);
      
      const result = await controller.ask(weirdQuestion);
      
      expect(chatbotService.getAnswer).toHaveBeenCalledWith(weirdQuestion);
      expect(result).toEqual({ answer: expectedAnswer });
    });
  });

  describe('security tests', () => {
    it('should handle very long questions within reasonable limits', async () => {
      const veryLongQuestion = 'latihan '.repeat(5000);
      const expectedAnswer = 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda.';
      
      mockChatbotService.getAnswer.mockResolvedValue(expectedAnswer);
      
      const result = await controller.ask(veryLongQuestion);
      
      expect(chatbotService.getAnswer).toHaveBeenCalledWith(veryLongQuestion);
      expect(result).toEqual({ answer: expectedAnswer });
    });

    it('should process data URIs and embedded content safely', async () => {
      const dataUriQuestion = 'Latihan yang bagus untuk data:text/html,<script>alert("XSS")</script>?';
      const expectedAnswer = 'Maaf, saya Asisten Woreps yang hanya dapat membantu Anda dengan informasi seputar latihan fisik dan kebugaran. Dapatkah saya membantu Anda menemukan program latihan yang sesuai?';
      
      mockChatbotService.getAnswer.mockResolvedValue(expectedAnswer);
      
      const result = await controller.ask(dataUriQuestion);
      
      expect(chatbotService.getAnswer).toHaveBeenCalledWith(dataUriQuestion);
      expect(result).toEqual({ answer: expectedAnswer });
    });

    it('should handle questions with embedded JSON safely', async () => {
      const jsonQuestion = '{"question": "Bagaimana cara membuat HTML?", "context": "fitness"}';
      const expectedAnswer = 'Maaf, saya Asisten Woreps yang hanya dapat membantu Anda dengan informasi seputar latihan fisik dan kebugaran. Dapatkah saya membantu Anda menemukan program latihan yang sesuai?';
      
      mockChatbotService.getAnswer.mockResolvedValue(expectedAnswer);
      
      const result = await controller.ask(jsonQuestion);
      
      expect(chatbotService.getAnswer).toHaveBeenCalledWith(jsonQuestion);
      expect(result).toEqual({ answer: expectedAnswer });
    });
  });
});