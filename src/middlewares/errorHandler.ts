import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (err instanceof ZodError) {
        return response.status(400).json({
            message: 'Erro de validação',
            issues: err.format(),
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}
