import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const entitySchema = z.object({
    name: z.string().min(2),
});

export const PersonController = {
    async index(req: Request, res: Response) {
        const userId = (req as any).userId;
        const persons = await prisma.person.findMany({ where: { userId } });
        return res.json(persons);
    },

    async create(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { name } = entitySchema.parse(req.body);

        const exists = await prisma.person.findUnique({
            where: { name_userId: { name, userId } },
        });

        if (exists) return res.status(400).json({ message: 'Pessoa já cadastrada' });

        const person = await prisma.person.create({ data: { name, userId } });
        return res.status(201).json(person);
    },
};

export const CategoryController = {
    async index(req: Request, res: Response) {
        const userId = (req as any).userId;
        const items = await prisma.category.findMany({ where: { userId } });
        return res.json(items);
    },

    async create(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { name } = entitySchema.parse(req.body);

        const exists = await prisma.category.findUnique({
            where: { name_userId: { name, userId } },
        });

        if (exists) return res.status(400).json({ message: 'Categoria já cadastrada' });

        const item = await prisma.category.create({ data: { name, userId } });
        return res.status(201).json(item);
    },
};
