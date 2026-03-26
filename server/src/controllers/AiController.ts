import type { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/AiService.js';
import { conversationService } from '../services/ConversationService.js';

class AiController {
    private static instance: AiController;

    private constructor() {}

    public static getInstance(): AiController {
        if (!AiController.instance) {
            AiController.instance = new AiController();
        }
        return AiController.instance;
    }

    public askAi = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { prompt } = req.body as { prompt: string };
            const result = await aiService.getCompletion(prompt);

            res.status(200).json({
                status: 200,
                message: 'AI response generated successfully',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    };

    public save = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { prompt, response } = req.body as { prompt: string; response: string };
            const conversation = await conversationService.save(prompt, response);

            res.status(201).json({
                status: 201,
                message: 'Conversation saved successfully',
                data: conversation,
            });
        } catch (err) {
            next(err);
        }
    };

    public getConversations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const conversations = await conversationService.getAll();

            res.status(200).json({
                status: 200,
                message: 'Conversations fetched successfully',
                data: conversations,
            });
        } catch (err) {
            next(err);
        }
    };
}

export const aiController = AiController.getInstance();
