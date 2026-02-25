import { Router } from 'express';
import { PersonController, CategoryController } from '../controllers/EntitiesController';
import { TransactionController } from '../controllers/TransactionController';
import { authMiddleware } from '../middlewares/auth';

const entitiesRoutes = Router();

entitiesRoutes.use(authMiddleware);

entitiesRoutes.get('/persons', PersonController.index);
entitiesRoutes.post('/persons', PersonController.create);

entitiesRoutes.get('/categories', CategoryController.index);
entitiesRoutes.post('/categories', CategoryController.create);

entitiesRoutes.get('/transactions', TransactionController.index);
entitiesRoutes.post('/transactions', TransactionController.create);

export default entitiesRoutes;
