import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const AuthController = {
    async register(req: Request, res: Response) {
        const { name, email, password } = registerSchema.parse(req.body);

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'E-mail indisponível' });
        }

        const user = await prisma.user.create({
            data: { name, email, password },
        });

        return res.status(201).json({ id: user.id, name: user.name, email: user.email });
    },

    async login(req: Request, res: Response) {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecreto', {
            expiresIn: '7d',
        });

        return res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    },
};
