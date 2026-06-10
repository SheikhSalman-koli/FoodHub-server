import { prisma } from "../../lib/prisma"

type CreateProviderInput = {
    authoremail: string,
    restaurantName: string,
    tagline: string,
    location: string,
    logo?: string
}

const createProvider = async (providerData: CreateProviderInput) => {
    const result = await prisma.provider.create({
        data: providerData
    })
    return result
}


const getAllProvider = async ()=> {
    const result = await prisma.provider.findMany({
        include: {
            meals: true
        }
    })
    return result
}



export const providerService = {
    getAllProvider,
    createProvider
}