const prisma = require("../../prismaClient");

const setBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { categoryId, amount } = req.body;

        if (!categoryId || !amount) {
            return res.status(400).json({ message: "Category ID and amount are required." });
        }

        // Manually find the existing budget first
        const existingBudget = await prisma.budget.findFirst({
            where: {
                userId,
                categoryId: parseInt(categoryId)
            }
        });

        let budget;
        if (existingBudget) {
            // Budget exists -> UPDATE it using the safe primary key (id)
            budget = await prisma.budget.update({
                where: { id: existingBudget.id },
                data: { amount: parseFloat(amount) },
                include: { category: true }
            });
        } else {
            // Budget doesn't exist -> CREATE a new one
            budget = await prisma.budget.create({
                data: {
                    userId,
                    categoryId: parseInt(categoryId),
                    amount: parseFloat(amount)
                },
                include: { category: true }
            });
        }

        res.status(200).json(budget);
    } catch (error) {
        next(error);
    }
};


const getBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch all budgets for this user
        const budget = await prisma.budget.findMany({
            where: { userId },
            include: { category: true }
        });

        // Calculate the first day of the current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // For each budget, dynamically calculate how much has been spent this month!
        const budgetWithSpending = await Promise.all(budget.map(async (budget) => {
            const spentAggregate = await prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    userId,
                    categoryId: budget.categoryId,
                    type: 'EXPENSE',
                    date: { gte: startOfMonth }
                }
            });
            return {
                ...budget,
                spent: spentAggregate._sum.amount || 0
            };
        }));
        res.status(200).json(budgetWithSpending);
    } catch (error) {
        next(error);
    }
};

const deleteBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const budgetId = parseInt(req.params.id);

        await prisma.budget.delete({
            where: {
                id: budgetId, userId
            }
        });
        res.status(200).json({ message: "budget deleted successfully" });
    } catch (error) {
        next(error);
    }
};


module.exports = { setBudget, getBudget, deleteBudget };