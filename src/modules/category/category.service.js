import { prisma } from "../../lib/prisma.js";
const createCategory = async (body) => {
    const result = await prisma.category.create({
        data: body
    });
    return result;
};
const getAvailableCategories = async () => {
    const result = await prisma.category.findMany({
        where: {
            isAvailable: true,
            // isDeleted: false
        }
    });
    return result;
};
const getAllCategories = async () => {
    const result = await prisma.category.findMany();
    return result;
};
const getCategoryById = async (id) => {
    const result = await prisma.category.findFirst({
        where: {
            id: id,
        }
    });
    return result;
};
const updateCategory = async (id, body) => {
    const result = await prisma.category.update({
        where: {
            id: id,
        },
        data: body
    });
    return result;
};
const softDeleteCategory = async (id, data) => {
    const result = await prisma.category.update({
        where: {
            id: id,
        },
        data: data
    });
    return result;
};
export const categoryService = {
    createCategory,
    getAllCategories,
    getAvailableCategories,
    getCategoryById,
    updateCategory,
    softDeleteCategory
};
