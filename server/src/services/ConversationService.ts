import { ConversationModel } from '../models/Conversation.js';
import { nimClient } from '../config/NimClient.js';
import { logger } from '../utils/Logger.js';
import type { IConversationDTO } from '../types/index.js';

class ConversationService {
    private static instance: ConversationService;

    private constructor() {}

    public static getInstance(): ConversationService {
        if (!ConversationService.instance) {
            ConversationService.instance = new ConversationService();
        }
        return ConversationService.instance;
    }

    public async save(prompt: string, response: string): Promise<IConversationDTO> {
        try {
            const conversation = await ConversationModel.create({
                prompt,
                response,
                model: nimClient.getModel(),
            });

            logger.success('CONVERSATION_SERVICE', `Saved conversation ${conversation._id}`);

            return {
                id: conversation._id.toString(),
                prompt: conversation.prompt,
                response: conversation.response,
                model: conversation.model,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
            };
        } catch (err: unknown) {
            logger.error('CONVERSATION_SERVICE', `Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            throw err;
        }
    }

    public async getAll(): Promise<IConversationDTO[]> {
        try {
            const conversations = await ConversationModel.find()
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            logger.info('CONVERSATION_SERVICE', `Fetched ${conversations.length} conversations`);

            return conversations.map((conv) => ({
                id: conv._id.toString(),
                prompt: conv.prompt,
                response: conv.response,
                model: conv.model,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
            }));
        } catch (err: unknown) {
            logger.error('CONVERSATION_SERVICE', `Fetch failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            throw err;
        }
    }
}

export const conversationService = ConversationService.getInstance();
