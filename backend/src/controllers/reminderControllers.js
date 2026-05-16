const prisma = require('../../prismaClient');

const createReminder = async (req, req, next) => {
    try {
        const userId = req.user.id;
        const { title, amount, dueDate, isRecurring, recurrence } = req.body;
        if (!title || !amount || !dueDate) {
            return res.status(400).json({ messages: 'Title, amount and due date are required' });
        }
        const reminder = await prisma.paymentReminder.create({
            data: {
                userId,
                title,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                isRecurring: isRecurring || false,
                recurrence: isRecurring ? recurrence : null
            }
        });
        res.status(201).json({ message: 'Reminder create successfully', reminder })
    } catch (error) {
        next(error);
    }
};

const getReminder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reminders = await prisma.paymentReminder.findMany({
            where: {
                userId,
            },
            orderBy: { dueDate: "asc" }
        });
        res.status(200).json(reminders);
    } catch (error) {
        next(error);
    }
};

const markAsPaid = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reminderId = parseInt(req.params.id);

        const reminder = await prisma.paymentReminder.update({
            where: { id: reminderId, userId },
            data: { isPaid: true }
        });
        res.status(200).json({ reminder, message: 'Reminder marked as paid' });
    } catch (error) {
        next(error);
    }
}

const deleteReminder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reminderId = parseInt(req.params.id);

        await prisma.paymentReminder.delete({
            where: { id: reminderId, userId }
        })
        res.status(200).json({ message: 'Reminder deleted successfully' })
    } catch (error) {
        next(error);
    }
};


module.exports = { createReminder, getReminder, markAsPaid, deleteReminder };