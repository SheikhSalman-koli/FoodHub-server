import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma"
import { userRole } from "../../middlewares/auth"



type CreateProviderInput = {
    name: string,
    email: string,
    password: string,
    phone: string,
    role: userRole
    authoremail: string,
    restaurantName: string,
    tagline?: string,
    location: string,
}

const createProvider = async (providerData: CreateProviderInput) => {
    const { name, email, password, role, restaurantName, tagline, location } = providerData;

    const authResult = await auth.api.signUpEmail({
        body: { name, email, password, role },
    });

    if (!authResult || !authResult.user) {
        throw new Error("ইউজার অ্যাকাউন্ট তৈরি করা যায়নি।");
    }
    const authorEmail = authResult.user.email;

    try {
       
        const result = await prisma.provider.create({
            data: {
                authoremail: authorEmail,
                restaurantName,
                tagline,
                location,
            }
        });
        
        return result;

    } catch (error: any) {
        try {
            await prisma.user.delete({
                where: { email: authorEmail },
            });
        } catch (deleteError) {
            console.error("Critical: Rollback failed for user:", authorEmail, deleteError);
        }
        throw new Error(error?.message || "রেস্টুরেন্ট ডিটেইলস সেভ করা যায়নি। রেজিস্ট্রেশন বাতিল করা হয়েছে।");
    }
}


const getAllProvider = async () => {
    const result = await prisma.provider.findMany({
        where: {
            isDeleted: false
        },
    })
    return result
}

const getSingleProvider = async (id: string) => {
    const result = await prisma.provider.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            meals: {
                where: {
                    isDeleted: false
                }
            }
        }

    })
    return result
}



export const providerService = {
    getAllProvider,
    createProvider,
    getSingleProvider
}