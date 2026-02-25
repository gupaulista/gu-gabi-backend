import { Router } from 'express';
import authRoutes from './auth.routes';
import aiRoutes from './ai.routes';
import entitiesRoutes from './entities.routes';
import { ConfigController } from '../controllers/ConfigController';
import { authMiddleware } from '../middlewares/auth';

const routes = Router();

routes.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Gestão Financeira Gu & Gabi API executando...' });
});

routes.use('/auth', authRoutes);
routes.use('/ai', aiRoutes);
routes.use('/crud', entitiesRoutes);

/* ── Rotas complementares (autenticadas) ── */
routes.get('/crud/monthly-goal', authMiddleware, ConfigController.getGoal);
routes.put('/crud/monthly-goal', authMiddleware, ConfigController.setGoal);
routes.get('/crud/api-config', authMiddleware, ConfigController.getApiConfig);
routes.put('/crud/api-config', authMiddleware, ConfigController.setApiConfig);
routes.delete('/crud/persons/:id', authMiddleware, ConfigController.deletePerson);
routes.delete('/crud/categories/:id', authMiddleware, ConfigController.deleteCategory);
routes.delete('/crud/transactions/:id', authMiddleware, ConfigController.deleteTransaction);

export default routes;
