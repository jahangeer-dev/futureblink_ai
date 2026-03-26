import type { Request, Response, NextFunction } from 'express';

class RequestValidator {
    private static instance: RequestValidator;

    private constructor() {}

    public static getInstance(): RequestValidator {
        if (!RequestValidator.instance) {
            RequestValidator.instance = new RequestValidator();
        }
        return RequestValidator.instance;
    }

    public validateAskAi = (req: Request, _res: Response, next: NextFunction): void => {
        const { prompt } = req.body as { prompt?: string };

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            const error = new Error('Prompt is required and must be a non-empty string') as Error & { statusCode: number };
            error.statusCode = 400;
            next(error);
            return;
        }

        next();
    };

    public validateSave = (req: Request, _res: Response, next: NextFunction): void => {
        const { prompt, response } = req.body as { prompt?: string; response?: string };

        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            const error = new Error('Prompt is required and must be a non-empty string') as Error & { statusCode: number };
            error.statusCode = 400;
            next(error);
            return;
        }

        if (!response || typeof response !== 'string' || response.trim().length === 0) {
            const error = new Error('Response is required and must be a non-empty string') as Error & { statusCode: number };
            error.statusCode = 400;
            next(error);
            return;
        }

        next();
    };
}

export const requestValidator = RequestValidator.getInstance();
