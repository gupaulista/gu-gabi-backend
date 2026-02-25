import { Router } from 'express';
import { AiController } from '../controllers/AiController';
import { authMiddleware } from '../middlewares/auth';

const aiRoutes = Router();

aiRoutes.post('/process', authMiddleware, AiController.process);

export default aiRoutes;
