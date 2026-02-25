import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token authentication missing' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecreto') as { id: string };

        (req as any).userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalido' });
    }
}
