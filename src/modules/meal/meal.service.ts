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

const getemeals = async (query: Record<string, unknown>) => {

    const { searchTerm, category, restaurantName, minPrice, maxPrice, sortBy, sortOrder } = query

    const andConditions: Prisma.MealWhereInput[] = [
        { isDeleted: false }
    ]

    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm as string, mode: "insensitive" } },
                { description: { contains: searchTerm as string, mode: "insensitive" } },
            ]
        })
    }

    if (category) {
        andConditions.push({
            category: {
                slug: {
                    equals: category as string,
                    mode: 'insensitive'
                }
            }
        })
    }

    if (restaurantName) {
        andConditions.push({
            provider: {
                restaurantName: {
                    equals: restaurantName as string,
                    mode: "insensitive"
                }
            }
        })
    }

    // 💰 ৪. Price Range ফিল্টার
    const priceFilter: Prisma.DecimalFilter = {}
    if (minPrice !== undefined) {
        priceFilter.gte = new Prisma.Decimal(String(minPrice))
    }
    if (maxPrice !== undefined) {
        priceFilter.lte = new Prisma.Decimal(String(maxPrice))
    }

    if (Object.keys(priceFilter).length) {
        andConditions.push({ price: priceFilter })
    }

    let orderByCondition: Record<string, string> = { orderCount: "desc" };

    if (sortBy === "price" && (sortOrder === "asc" || sortOrder === "desc")) {
        orderByCondition = {
            price: sortOrder
        };
    }


    const result = await prisma.meal.findMany({
        where: {
            isDeleted: false,
            AND: andConditions
        },
        orderBy: orderByCondition,
    })

    return result
}

const getSingleMeal = async (id: string) => {
    const result = await prisma.meal.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    }
                }
            }
        }
    })

    const similarMeals = await prisma.meal.findMany({
        where: {
            categoryId: result?.categoryId, 
            id: { not: id },          
            isDeleted: false
        },
        take: 4, 
        orderBy: {
            orderCount: 'desc' 
        }
    });

    return {
        ...result,
        similarMeals
    }
}


const editMeal = async (
    id: string,
    updatedData: Prisma.MealUncheckedUpdateInput,
    email: string
) => {

    const getProviderId = await prisma.provider.findUnique({
        where: {
            authoremail: email
        },
        select: {
            id: true
        }
    })

    const getProviderIdFromMeal = await prisma.meal.findUnique({
        where: {
            id: id
        },
        select: {
            providerId: true
        }
    })

    const isValidProvider = getProviderId?.id === getProviderIdFromMeal?.providerId

    if (!isValidProvider) {
        throw new Error("this food is not from your rastaurant!")
    }

    const result = await prisma.meal.update({
        where: {
            id: id,
            isDeleted: false
        },
        data: updatedData
    })

    return result
}


const softDeleteMeal = async (
    id: string,
    updatedData: Prisma.MealUncheckedUpdateInput,
    email: string
) => {

    const getProviderId = await prisma.provider.findUnique({
        where: {
            authoremail: email
        },
        select: {
            id: true
        }
    })

    const getProviderIdFromMeal = await prisma.meal.findUnique({
        where: {
            id: id
        },
        select: {
            providerId: true
        }
    })

    const isValidProvider = getProviderId?.id === getProviderIdFromMeal?.providerId

    if (!isValidProvider) {
        throw new Error("this food is not from your rastaurant!")
    }



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