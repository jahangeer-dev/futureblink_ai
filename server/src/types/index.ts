import type { Types } from 'mongoose';

export interface IConversation {
    _id?: Types.ObjectId;
    prompt: string;
    response: string;
    model: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IAiCompletionRequest {
    prompt: string;
    model?: string;
}

export interface IAiCompletionResponse {
    response: string;
    model: string;
}

export interface IOpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface IOpenRouterChoice {
    index: number;
    message: {
        role: string;
        content: string;
    };
    finish_reason: string;
}

export interface IOpenRouterStreamChoice {
    index: number;
    delta: {
        role?: string;
        content?: string;
    };
    finish_reason: string | null;
}

export interface IOpenRouterResponse {
    id: string;
    model: string;
    choices: IOpenRouterChoice[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface IOpenRouterStreamChunk {
    id: string;
    model: string;
    choices: IOpenRouterStreamChoice[];
}

export interface IConversationDTO {
    id: string;
    prompt: string;
    response: string;
    model: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISaveConversationRequest {
    prompt: string;
    response: string;
}

export interface IApiResponse<T = unknown> {
    status: number;
    message: string;
    data: T;
}
