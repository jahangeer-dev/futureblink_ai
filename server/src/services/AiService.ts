import { nimClient } from '../config/NimClient.js';
import { logger } from '../utils/Logger.js';
import type { IAiCompletionResponse } from '../types/index.js';

class AiService {
    private static instance: AiService;

    private constructor() {}

    public static getInstance(): AiService {
        if (!AiService.instance) {
            AiService.instance = new AiService();
        }
        return AiService.instance;
    }

    public async getCompletion(prompt: string): Promise<IAiCompletionResponse> {
        if (!prompt || prompt.trim().length === 0) {
            throw new Error('Prompt cannot be empty');
        }

        try {
            const result = await nimClient.generateCompletion(prompt.trim());
            logger.success('AI_SERVICE', 'Completion generated successfully');
            return result;
        } catch (err: unknown) {
            logger.error('AI_SERVICE', `Completion failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            throw err;
        }
    }

    public async *streamCompletion(prompt: string): AsyncGenerator<string, void, unknown> {
        if (!prompt || prompt.trim().length === 0) {
            throw new Error('Prompt cannot be empty');
        }

        try {
            logger.info('AI_SERVICE', 'Starting stream completion');
            yield* nimClient.streamCompletion(prompt.trim());
        } catch (err: unknown) {
            logger.error('AI_SERVICE', `Stream failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            throw err;
        }
    }
}

export const aiService = AiService.getInstance();
