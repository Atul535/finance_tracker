const prisma = require('../../prismaClient');

const createCategory = async (req, res, next) => {
    try {
        const { name, type, color } = req.body;
        const userId = req.user.id;
        if (!name || !type) {
            return res.status(400).json({ message: "Name and type (Income/Expense) are required" });
        }
        const newCategory = await prisma.category.create({
            data: {
                userId,
                name,
                type: type.toUpperCase(),
                color
            }
        });
        return res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const categories = await prisma.categories.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const categryId = parseInt(req.params.id);
        const userId = req.user.id;

        const category = await prisma.category.findFirst({
            where: { id: categryId, userId }
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await prisma.category.delete({
            where: { id: categoryId }
        });
        return res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { name, type, color } = req.body;
        const userId = req.user.id;

        const category = await prisma.category.findFirst({
            where: { id: categryId, userId }
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await prisma.category.update({
            where: { id: categoryId },
            data: { name, type: type.toUpperCase(), color }
        });
        return res.status(200).json({ message: "Category updated successfully" });

    } catch (error) {
        next(error);
    }
};

module.exports = { createCategory, getCategories, deleteCategory, updateCategory };