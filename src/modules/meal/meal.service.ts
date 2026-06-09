import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"

type mealBody = {
    categoryId: string;
    providerId: string;
    name: string;
    description: string;
    image: string;
    orderCount: number;
    price: number
}

// type updatedMeal = {
//     categoryId: string;
//     name: string;
//     description: string;
//     image: string;
//     price: number
// }

const createmeal = async (body: mealBody) => {
    const result = await prisma.meal.create({
        data: body
    })

    return result
}

const getemeals = async () => {
    const result = await prisma.meal.findMany({
        where: {
            isDeleted: false
        },
    })

    return result
}

const getSingleMeal = async (id: string) => {
    const result = await prisma.meal.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })

    return result
}

const editMeal = async(
    id: string, 
    updatedData: Prisma.MealUncheckedUpdateInput
)=>{
    const result = await prisma.meal.update({
        where: {
            id: id,
            isDeleted: false
        },
        data: updatedData
    })

    return result
}

const softDeleteMeal = async(
    id: string, 
    updatedData: Prisma.MealUncheckedUpdateInput
)=>{
    const result = await prisma.meal.update({
        where: {
            id: id
        },
        data: updatedData
    })

    return result
}


export const mealService = {
    createmeal,
    getemeals,
    getSingleMeal,
    editMeal,
    softDeleteMeal
}