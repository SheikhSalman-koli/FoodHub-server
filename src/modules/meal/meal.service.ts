import { prisma } from "../../lib/prisma"

type mealBody = {
    categoryId: string;
    providerId: string;
    name: string;
    description: string;
    orderCount: number;
    price: number
}

const createmeal = async (body: mealBody) => {
    const result = await prisma.meal.create({
        data: body
    })

    return result
}


export const mealService = {
    createmeal
}