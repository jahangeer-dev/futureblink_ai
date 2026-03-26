import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import type { Socket } from 'socket.io';
import { aiService } from '../services/AiService.js';
import { logger } from '../utils/Logger.js';

class SocketManager {
    private static instance: SocketManager;
    private io: SocketServer | null = null;

    private constructor() {}

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    public initialize(httpServer: HttpServer): SocketServer {
        this.io = new SocketServer(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info('SOCKET', `Client connected: ${socket.id}`);
            this.registerEventHandlers(socket);

            socket.on('disconnect', () => {
                logger.info('SOCKET', `Client disconnected: ${socket.id}`);
            });
        });

        logger.info('SOCKET', 'Socket.IO initialized');
        return this.io;
    }

    private registerEventHandlers(socket: Socket): void {
        socket.on('ai:prompt:stream', async (data: { prompt: string }) => {
            const { prompt } = data;

            if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
                socket.emit('ai:stream:error', { error: 'Prompt is required and must be a non-empty string' });
                return;
            }

            try {
                logger.info('SOCKET', `Stream request from ${socket.id}: "${prompt.slice(0, 50)}..."`);

                for await (const chunk of aiService.streamCompletion(prompt)) {
                    socket.emit('ai:stream:chunk', { chunk });
                }

                socket.emit('ai:stream:end', { message: 'Stream completed' });
                logger.success('SOCKET', `Stream completed for ${socket.id}`);
            } catch (err: unknown) {
                logger.error('SOCKET', `Stream error for ${socket.id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
                socket.emit('ai:stream:error', {
                    error: err instanceof Error ? err.message : 'An error occurred during streaming',
                });
            }
        });
    }

    public getIO(): SocketServer | null {
        return this.io;
    }
}

export const socketManager = SocketManager.getInstance();
