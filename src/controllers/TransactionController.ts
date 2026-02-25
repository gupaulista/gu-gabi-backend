import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const transactionSchema = z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    date: z.string(), // ISO String da Data
    time: z.string().nullable().optional(),
    description: z.string(),
    personId: z.string().uuid(),
    categoryId: z.string().uuid(),
});

export const TransactionController = {
    async index(req: Request, res: Response) {
        const userId = (req as any).userId;
        // Opcional: receber month e year em query string e filtrar

        const transactions = await prisma.transaction.findMany({
            where: {
                person: { userId }, // Acessa somente das pessoas do usuário atual
            },
            include: { person: true, category: true },
            orderBy: { date: 'desc' }
        });

        return res.json(transactions);
    },

    async create(req: Request, res: Response) {
        const userId = (req as any).userId;
        const data = transactionSchema.parse(req.body);

        // Valida propriedades para ver se pertencem ao usuário atual
        const person = await prisma.person.findFirst({
            where: { id: data.personId, userId }
        });

        if (!person) return res.status(404).json({ message: "Pessoa não pertencente ao usuário" });

        const transaction = await prisma.transaction.create({
            data: {
                amount: data.amount,
                type: data.type,
                date: new Date(data.date),
                time: data.time || null,
                description: data.description,
                personId: data.personId,
                categoryId: data.categoryId,
            }
        });

        return res.status(201).json(transaction);
    }
};
