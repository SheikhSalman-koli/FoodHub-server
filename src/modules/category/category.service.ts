import { prisma } from "../../lib/prisma"

type categoryBody = {
    name: string;
    slug: string;
    logo?: string;
    isDeleted?: boolean;
}

const createCategory = async(body: categoryBody) => {
    const result = await prisma.category.create({
        data:   body
    })

    return result
}

const getAllCategories = async() => {
    const result = await prisma.category.findMany({
        where: {
            isDeleted: false
        }
    })  

    return result
}

const getCategoryById = async(id: string) => {
    const result = await prisma.category.findFirst({
        where: {
            id: id,
            isDeleted: false
        }
    })

    return result
}


const updateCategory = async(id: string, body: Partial<categoryBody>) => {
    const result = await prisma.category.update({
        where: {
            id: id,
            isDeleted: false
        },
        data: body
    })

    return result
}

const softDeleteCategory = async(id: string, data: Partial<categoryBody>) => {
    const result = await prisma.category.update({
        where: {
            id: id,
        },
        data: data
    })

    return result
}

export const categoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    softDeleteCategory
}
  
