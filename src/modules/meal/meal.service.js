import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
const createmeal = async (body, email) => {
    const provider = await prisma.provider.findUnique({
        where: {
            authoremail: email
        },
        select: {
            id: true
        }
    });
    if (!provider) {
        throw new Error("প্রোভাইডার প্রোফাইল খুঁজে পাওয়া যায়নি!");
    }
    const result = await prisma.meal.create({
        data: {
            name: body.name,
            description: body.description,
            image: body.image,
            price: Number(body.price),
            discount: Number(body.discount) || 0,
            categoryId: body.categoryId,
            providerId: provider?.id,
        },
    });
    return result;
};
const getemeals = async (query) => {
    const { search, category, restaurantName, minPrice, maxPrice, sortBy, sortOrder } = query;
    const andConditions = [
        { isDeleted: false }
    ];
    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ]
        });
    }
    if (category) {
        andConditions.push({
            category: {
                slug: {
                    equals: category,
                    mode: 'insensitive'
                }
            }
        });
    }
    if (restaurantName) {
        andConditions.push({
            provider: {
                restaurantName: {
                    equals: restaurantName,
                    mode: "insensitive"
                }
            }
        });
    }
    // ৪. Price Range ফিল্টার
    const priceFilter = {};
    if (minPrice !== undefined) {
        priceFilter.gte = new Prisma.Decimal(String(minPrice));
    }
    if (maxPrice !== undefined) {
        priceFilter.lte = new Prisma.Decimal(String(maxPrice));
    }
    if (Object.keys(priceFilter).length) {
        andConditions.push({ price: priceFilter });
    }
    let orderByCondition = { orderCount: "desc" };
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
    });
    return result;
};
const getProviderMeals = async (provideremail) => {
    const result = await prisma.meal.findMany({
        where: {
            provider: {
                authoremail: provideremail
            }
        }
    });
    return result;
};
const getSingleMeal = async (id) => {
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
    });
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
    };
};
const editMeal = async (id, updatedData, email) => {
    const getProviderId = await prisma.provider.findUnique({
        where: {
            authoremail: email
        },
        select: {
            id: true
        }
    });
    const getProviderIdFromMeal = await prisma.meal.findUnique({
        where: {
            id: id
        },
        select: {
            providerId: true
        }
    });
    const isValidProvider = getProviderId?.id === getProviderIdFromMeal?.providerId;
    if (!isValidProvider) {
        throw new Error("this food is not from your rastaurant!");
    }
    const result = await prisma.meal.update({
        where: {
            id: id,
            isDeleted: false
        },
        data: updatedData
    });
    return result;
};
const softDeleteMeal = async (id, updatedData, email) => {
    const getProviderId = await prisma.provider.findUnique({
        where: {
            authoremail: email
        },
        select: {
            id: true
        }
    });
    const getProviderIdFromMeal = await prisma.meal.findUnique({
        where: {
            id: id
        },
        select: {
            providerId: true
        }
    });
    const isValidProvider = getProviderId?.id === getProviderIdFromMeal?.providerId;
    if (!isValidProvider) {
        throw new Error("this food is not from your rastaurant!");
    }
    const result = await prisma.meal.update({
        where: {
            id: id
        },
        data: updatedData
    });
    return result;
};
export const mealService = {
    createmeal,
    getemeals,
    getSingleMeal,
    editMeal,
    softDeleteMeal,
    getProviderMeals
};
