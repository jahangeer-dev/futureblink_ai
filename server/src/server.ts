import express from 'express';
import type { Express } from 'express';
import { createServer } from 'http';
import type { Server as HttpServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { database } from './config/Database.js';
import { socketManager } from './config/SocketManager.js';
import { aiRouter } from './routes/ai.routes.js';
import { errorHandler } from './middlewares/ErrorHandler.js';
import { logger } from './utils/Logger.js';

dotenv.config();

class App {
    private static instance: App;
    private readonly app: Express;
    private readonly httpServer: HttpServer;

    private constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public async start(): Promise<void> {
        await this.initializeDependencies();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSocketIO();
        this.initializeErrorHandling();
        this.listen();
        this.handleProcessSignals()
    }

    private async initializeDependencies(): Promise<void> {
        await database.connect();
    }

    private initializeMiddlewares(): void {
        const corsOptions = {
            origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
                // Allow requests with no origin (like mobile apps, curl, Postman)
                if (!origin) return callback(null, true);
                
                const allowedOrigins = [
                    'http://localhost:5173',
                    'http://3.95.59.74:5173',
                    'http://3.95.59.74:5000',
                    process.env.CLIENT_URL || 'http://localhost:5173'
                ];
                
                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };

        this.app.use(cors(corsOptions));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json({ limit: '10mb' }));
    }

    private initializeRoutes(): void {
        this.app.use('/api', aiRouter);
    }

    private initializeSocketIO(): void {
        socketManager.initialize(this.httpServer);
    }

    private initializeErrorHandling(): void {
        this.app.use(errorHandler.handle);
    }

    private listen(): void {
        const port = Number(process.env.PORT) || 5000;
        const host='0.0.0.0';
        this.httpServer.listen(port, host, () => {
            logger.info('SERVER', `App is running at ${port}`);
        });
    }

    private handleProcessSignals(): void {
        process.on('SIGTERM', async () => {
            await database.disconnect();
            logger.info('SERVER', 'SIGTERM received. Shutting down gracefully.');
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            await database.disconnect();
            logger.info('SERVER', 'SIGINT (Ctrl+C) received. Shutting down gracefully.');
            process.exit(0);
        });

        process.on('uncaughtException', (err: Error) => {
            logger.error('SERVER', `Uncaught exception: ${err.message}`);
        });
    }
}

const app = App.getInstance();

app.start().catch((err) => {
    logger.error('SERVER', `Failed to start: ${err instanceof Error ? err.message : 'Unknown error'}`);
    process.exit(1);
});
