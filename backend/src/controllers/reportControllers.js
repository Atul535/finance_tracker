const prisma = require('../../prismaClient');

const getMonthlySummary = async (req, res, next) => {
    try {
        const userId = req.user.id;

        //get the last six months of data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: { gte: sixMonthsAgo }
            },
            select: { amount: true, type: true, date: true }
        });

        // Group by month manually
        const monthlyMap = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyMap[key]) {
                monthlyMap[key] = { month: key, income: 0, expense: 0 };
            }
            if (tx.type === 'INCOME') {
                monthlyMap[key].income += tx.amount;
            } else {
                monthlyMap[key].expense += tx.amount;
            }
        });
        const result = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getCategoryBreakdown = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // get all transactions grouped by category
        const transactions = await prisma.transaction.findMany({
            where: { userId, type: 'EXPENSE' },
            include: { category: { select: { name: true, color: true } } }
        });

        //group by catergory
        const categoryMap = {};
        transactions.forEach(tx => {
            const catName = tx.category.name;
            if (!categoryMap[catName]) {
                categoryMap[catName] = { name: catName, color: tx.category.color, total: 0 };
            }
            categoryMap[catName].total += tx.amount;
        });
        const result = Object.values(categoryMap).sort((a, b) => b.total - a.total);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getMonthlySummary, getCategoryBreakdown };