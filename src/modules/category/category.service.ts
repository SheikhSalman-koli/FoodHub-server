import { prisma } from "../../lib/prisma"

type categoryBody = {
    name: string;
    tagline?: string;
    logo?: string
}

const createCategory = async(body: categoryBody) => {
    const result = await prisma.category.create({
        data:   body
    })

    return result
}


export const categoryService = {
    createCategory
}