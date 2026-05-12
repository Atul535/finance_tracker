const prisma = require('../../prismaClient');

const createTransaction = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { amount, type, date, notes, categoryId } = req.body;

        if (!amount || !type || !date || !categoryId) {
            return res.status(400).json({ message: 'Fields are required!' })
        }
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                categoryId: parseInt(categoryId),
                amount: parseFloat(amount),
                date: new Date(date),
                notes: notes || null,
                type
            },
            include: { category: true }
        });
        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
};

const getTransaction = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
            orderBy: {
                date: 'desc'
            }
        });
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const transaction = await prisma.transaction.findUnique({ where: { id: parseInt(id) } });
        if (!transaction || transaction.userId !== userId) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized!!' });
        }
        await prisma.transaction.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Transaction deleted successfully!!' });
    } catch (error) {
        next(error);
    }
};

module.exports = {createTransaction,getTransaction,deleteTransaction};