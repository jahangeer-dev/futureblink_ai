import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/Logger.js';

dotenv.config();

class Database {
    private static instance: Database;
    private readonly mongoUri: string;

    private constructor() {
        this.mongoUri = process.env.MONGODB_URI ?? '';
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.mongoUri);
            logger.success('MONGODB', 'Connected successfully');
        } catch (err: unknown) {
            logger.error('MONGODB', `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            logger.error('MONGODB', 'Shutting down application due to MongoDB connection failure');
            process.exit(1);
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            logger.info('MONGODB', 'Disconnected successfully');
        } catch (err: unknown) {
            logger.error('MONGODB', `Disconnect failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }

    public getConnection(): typeof mongoose {
        return mongoose;
    }
}

export const database = Database.getInstance();
