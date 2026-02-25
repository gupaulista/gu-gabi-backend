import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Rodando seed...');

    // ── Usuário 1 ──
    const user1 = await prisma.user.upsert({
        where: { email: 'gustavo@maluca.com' },
        update: {},
        create: { name: 'Gustavo', email: 'gustavo@maluca.com', password: '123456' },
    });

    // ── Usuário 2 ──
    const user2 = await prisma.user.upsert({
        where: { email: 'gabriela@maluca.com' },
        update: {},
        create: { name: 'Gabriela', email: 'gabriela@maluca.com', password: '123456' },
    });

    // ── Persons (Usuário 1) ──
    const gustavo = await prisma.person.upsert({
        where: { name_userId: { name: 'Gustavo', userId: user1.id } },
        update: {},
        create: { name: 'Gustavo', userId: user1.id },
    });

    const gabriela = await prisma.person.upsert({
        where: { name_userId: { name: 'Gabriela', userId: user1.id } },
        update: {},
        create: { name: 'Gabriela', userId: user1.id },
    });

    // ── Categories (Usuário 1) ──
    const catNames = ['Mercado', 'Lazer', 'iFood', 'Carro', 'Salário', 'Casa', 'Fubá (Cachorro)'];
    const cats: Record<string, string> = {};

    for (const name of catNames) {
        const cat = await prisma.category.upsert({
            where: { name_userId: { name, userId: user1.id } },
            update: {},
            create: { name, userId: user1.id },
        });
        cats[name] = cat.id;
    }

    // ── Meta mensal ──
    await prisma.monthlyGoal.upsert({
        where: { month_year_userId: { month: 2, year: 2026, userId: user1.id } },
        update: {},
        create: { month: 2, year: 2026, amount: 5000, userId: user1.id },
    });

    // ── Transações (3 meses: Dez/2025, Jan/2026, Fev/2026) ──
    const txData = [
        // Dezembro 2025
        { amount: 4500, type: 'INCOME', date: '2025-12-05', description: 'Salário dezembro', personId: gustavo.id, categoryId: cats['Salário'] },
        { amount: 350, type: 'EXPENSE', date: '2025-12-08', description: 'Compras de mercado semanais', personId: gabriela.id, categoryId: cats['Mercado'] },
        { amount: 120, type: 'EXPENSE', date: '2025-12-12', description: 'Pedidos iFood fim de semana', personId: gustavo.id, categoryId: cats['iFood'] },
        { amount: 90, type: 'EXPENSE', date: '2025-12-20', description: 'Ração e petiscos do Fubá', personId: gabriela.id, categoryId: cats['Fubá (Cachorro)'] },
        { amount: 600, type: 'EXPENSE', date: '2025-12-25', description: 'Presente de Natal e lazer', personId: gustavo.id, categoryId: cats['Lazer'] },

        // Janeiro 2026
        { amount: 4500, type: 'INCOME', date: '2026-01-05', description: 'Salário janeiro', personId: gustavo.id, categoryId: cats['Salário'] },
        { amount: 2000, type: 'INCOME', date: '2026-01-10', description: 'Freelance extra', personId: gustavo.id, categoryId: cats['Salário'] },
        { amount: 420, type: 'EXPENSE', date: '2026-01-07', description: 'Compras supermercado', personId: gabriela.id, categoryId: cats['Mercado'] },
        { amount: 250, type: 'EXPENSE', date: '2026-01-15', description: 'Revisão do carro', personId: gustavo.id, categoryId: cats['Carro'] },
        { amount: 85, type: 'EXPENSE', date: '2026-01-18', description: 'iFood jan', personId: gabriela.id, categoryId: cats['iFood'] },
        { amount: 1200, type: 'EXPENSE', date: '2026-01-22', description: 'Aluguel parcial', personId: gustavo.id, categoryId: cats['Casa'] },

        // Fevereiro 2026
        { amount: 4500, type: 'INCOME', date: '2026-02-05', description: 'Salário fevereiro', personId: gustavo.id, categoryId: cats['Salário'] },
        { amount: 200, type: 'EXPENSE', date: '2026-02-10', description: 'Despesa em supermercado.', personId: gabriela.id, categoryId: cats['Mercado'] },
        { amount: 10, type: 'EXPENSE', date: '2026-02-14', description: 'Despesa em mercado', personId: gustavo.id, categoryId: cats['Mercado'] },
        { amount: 180, type: 'EXPENSE', date: '2026-02-18', description: 'Jantar fora no dia dos namorados', personId: gustavo.id, categoryId: cats['Lazer'] },
        { amount: 75, type: 'EXPENSE', date: '2026-02-20', description: 'Veterinário do Fubá', personId: gabriela.id, categoryId: cats['Fubá (Cachorro)'] },
    ];

    for (const tx of txData) {
        await prisma.transaction.create({
            data: {
                ...tx,
                date: new Date(tx.date),
                time: '10:00',
            },
        });
    }

    console.log('✅ Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
