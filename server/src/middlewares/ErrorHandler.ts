import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/Logger.js';

class ErrorHandler {
    private static instance: ErrorHandler;

    private constructor() {}

    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    public handle = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
        logger.error('ERROR_HANDLER', err.message);

        const statusCode = (err as NodeJS.ErrnoException & { statusCode?: number }).statusCode ?? 500;
        const message = err.message || 'Internal Server Error';

        res.status(statusCode).json({
            status: statusCode,
            message,
            data: {},
        });
    };
}

export const errorHandler = ErrorHandler.getInstance();
