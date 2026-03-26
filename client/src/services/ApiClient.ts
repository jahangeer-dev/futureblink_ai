import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface AiResponse {
    status: number;
    message: string;
    data: {
        response: string;
        model: string;
    };
}

interface SaveResponse {
    status: number;
    message: string;
    data: {
        id: string;
        prompt: string;
        response: string;
        model: string;
        createdAt: string;
        updatedAt: string;
    };
}

interface ConversationsResponse {
    status: number;
    message: string;
    data: Array<{
        id: string;
        prompt: string;
        response: string;
        model: string;
        createdAt: string;
        updatedAt: string;
    }>;
}

class ApiClient {
    private static instance: ApiClient;
    private readonly client: AxiosInstance;

    private constructor() {
        const baseURL = import.meta.env.VITE_API_URL || '';
        this.client = axios.create({
            baseURL: `${baseURL}/api`,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public async askAi(prompt: string): Promise<AiResponse> {
        const response = await this.client.post<AiResponse>('/ask-ai', { prompt });
        return response.data;
    }

    public async save(prompt: string, response: string): Promise<SaveResponse> {
        const res = await this.client.post<SaveResponse>('/save', { prompt, response });
        return res.data;
    }

    public async getConversations(): Promise<ConversationsResponse> {
        const response = await this.client.get<ConversationsResponse>('/conversations');
        return response.data;
    }
}

export const apiClient = ApiClient.getInstance();
