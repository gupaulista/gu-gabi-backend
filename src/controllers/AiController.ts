import { Request, Response } from 'express';
import { AiService } from '../services/AiService';
import { z } from 'zod';

const aiSchema = z.object({
    text: z.string().min(2),
});

export const AiController = {
    async process(req: Request, res: Response) {
        const userId = (req as any).userId;
        const { text } = aiSchema.parse(req.body);

        try {
            const result = await AiService.processTransactionText(userId, text);
            return res.json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    },
};
