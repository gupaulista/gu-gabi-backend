import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const goalSchema = z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2020),
    amount: z.number().positive(),
});

const apiConfigSchema = z.object({
    geminiKey: z.string().min(1),
});

export const ConfigController = {
    /* ── Meta Mensal ── */
    async getGoal(req: Request, res: Response) {
        const userId = (req as any).userId;
        const now = new Date();
        const goal = await prisma.monthlyGoal.findUnique({
            where: {
                month_year_userId: {
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                    userId,
                },
            },
        });
        return res.json(goal);
    },

    async setGoal(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { month, year, amount } = goalSchema.parse(req.body);

        const goal = await prisma.monthlyGoal.upsert({
            where: { month_year_userId: { month, year, userId } },
            update: { amount },
            create: { month, year, amount, userId },
        });

        return res.json(goal);
    },

    /* ── API Config ── */
    async getApiConfig(req: Request, res: Response) {
        const userId = (req as any).userId;
        const config = await prisma.apiConfig.findUnique({ where: { userId } });
        return res.json(config ? { hasKey: true } : { hasKey: false });
    },

    async setApiConfig(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { geminiKey } = apiConfigSchema.parse(req.body);

        const config = await prisma.apiConfig.upsert({
            where: { userId },
            update: { geminiKey },
            create: { geminiKey, userId },
        });

        return res.json({ success: true });
    },

    /* ── Delete Person ── */
    async deletePerson(req: Request, res: Response) {
        const userId = (req as any).userId;
        const id = req.params.id as string;

        const person = await prisma.person.findFirst({ where: { id, userId } });
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada' });

        await prisma.person.delete({ where: { id } });
        return res.json({ success: true });
    },

    /* ── Delete Category ── */
    async deleteCategory(req: Request, res: Response) {
        const userId = (req as any).userId;
        const id = req.params.id as string;

        const category = await prisma.category.findFirst({ where: { id, userId } });
        if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });

        await prisma.category.delete({ where: { id } });
        return res.json({ success: true });
    },

    /* ── Delete Transaction ── */
    async deleteTransaction(req: Request, res: Response) {
        const userId = (req as any).userId;
        const id = req.params.id as string;

        const tx = await prisma.transaction.findFirst({
            where: { id, person: { userId } },
        });
        if (!tx) return res.status(404).json({ message: 'Transação não encontrada' });

        await prisma.transaction.delete({ where: { id } });
        return res.json({ success: true });
    },
};
