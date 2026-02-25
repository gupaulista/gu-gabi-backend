import { GoogleGenAI } from '@google/genai';
import { prisma } from '../lib/prisma';

export const AiService = {
    async processTransactionText(userId: string, text: string) {
        const persons = await prisma.person.findMany({ where: { userId } });
        const categories = await prisma.category.findMany({ where: { userId } });

        let apiKey = process.env.GEMINI_API_KEY;
        const config = await prisma.apiConfig.findUnique({ where: { userId } });
        if (config?.geminiKey) {
            apiKey = config.geminiKey;
        }

        if (!apiKey) {
            throw new Error('Chave de API do Gemini não configurada.');
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
      Você é um assistente financeiro.
      Eu vou lhe passar um texto sobre um gasto ou recebimento.
      Extraia os campos no formato JSON:
      {
        "amount": número,
        "type": "INCOME" ou "EXPENSE",
        "date": "YYYY-MM-DD" (se omitido, use a data atual),
        "time": "HH:MM",
        "description": "breve e formal",
        "personId": "ID da pessoa responsável",
        "categoryId": "ID da categoria",
        "clarificationQuestion": "Se houver ambiguidade, escreva a pergunta e omita o resto (usando null). Se não houver, null."
      }

      Hoje é: ${new Date().toISOString().split('T')[0]}.

      Pessoas (ID - Nome):
      ${persons.map((p) => `${p.id} - ${p.name}`).join('\n')}

      Categorias (ID - Nome):
      ${categories.map((c) => `${c.id} - ${c.name}`).join('\n')}

      Texto: "${text}"

      Retorne estritamente o JSON.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const output = response.text || '';

        try {
            const jsonMatch = output.match(/\{[\s\S]*?\}/);
            if (!jsonMatch) throw new Error("JSON não encontrado no retorno da IA.");
            return JSON.parse(jsonMatch[0]);
        } catch (err) {
            throw new Error('Falha ao interpretar a saída do assistente: ' + output);
        }
    },
};
