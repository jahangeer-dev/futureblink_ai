import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
    IOpenRouterMessage,
    IOpenRouterResponse,
    IOpenRouterStreamChunk,
    IAiCompletionResponse,
} from '../types/index.js';

class NimClient {
    private static instance: NimClient;
    private readonly client: AxiosInstance;
    private readonly model: string;

    private constructor() {
        this.model = process.env.NVIDIA_NIM_MODEL ?? 'stepfun/step-1v';

        this.client = axios.create({
            baseURL: 'https://integrate.api.nvidia.com/v1',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
            },
        });
    }

    public static getInstance(): NimClient {
        if (!NimClient.instance) {
            NimClient.instance = new NimClient();
        }
        return NimClient.instance;
    }

    public async generateCompletion(prompt: string): Promise<IAiCompletionResponse> {
        const messages: IOpenRouterMessage[] = [
            { role: 'system', content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.' },
            { role: 'user', content: prompt },
        ];

        const response = await this.client.post<IOpenRouterResponse>('/chat/completions', {
            model: this.model,
            messages,
        });

        const choice = response.data.choices[0];
        if (!choice) {
            throw new Error('No response received from NVIDIA NIM');
        }

        return {
            response: choice.message.content,
            model: response.data.model,
        };
    }

    public async *streamCompletion(prompt: string): AsyncGenerator<string, void, unknown> {
        const messages: IOpenRouterMessage[] = [
            { role: 'system', content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.' },
            { role: 'user', content: prompt },
        ];

        const response = await this.client.post('/chat/completions', {
            model: this.model,
            messages,
            stream: true,
            max_tokens: 1024,
        }, {
            responseType: 'stream',
        });

        const stream = response.data as NodeJS.ReadableStream;
        let buffer = '';

        for await (const chunk of stream) {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith('data: ')) continue;

                const data = trimmed.slice(6);
                if (data === '[DONE]') return;

                try {
                    const parsed: IOpenRouterStreamChunk = JSON.parse(data);
                    const content = parsed.choices[0]?.delta?.content;
                    if (content) {
                        yield content;
                    }
                } catch {
                    continue;
                }
            }
        }
    }

    public getModel(): string {
        return this.model;
    }
}

export const nimClient = NimClient.getInstance();
