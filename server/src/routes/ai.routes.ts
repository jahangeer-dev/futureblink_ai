import { Router } from 'express';
import { aiController } from '../controllers/AiController.js';
import { requestValidator } from '../middlewares/RequestValidator.js';

class AiRouter {
    private static instance: AiRouter;
    private readonly router: Router;

    private constructor() {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post('/ask-ai', requestValidator.validateAskAi, aiController.askAi);
        this.router.post('/save', requestValidator.validateSave, aiController.save);
        this.router.get('/conversations', aiController.getConversations);
    }

    public getRouter(): Router {
        return this.router;
    }

    public static getInstance(): AiRouter {
        if (!AiRouter.instance) {
            AiRouter.instance = new AiRouter();
        }
        return AiRouter.instance;
    }
}

export const aiRouter = AiRouter.getInstance().getRouter();
