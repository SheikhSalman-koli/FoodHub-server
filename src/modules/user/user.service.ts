import { Prisma, userStatus, Role } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { userRole } from "../../middlewares/auth"


const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        where: {
            isDeleted: false,
            role: {
                not: "ADMIN"
            }
        }
    })
    return result
}



const updateCustomerProfile = async (id: string , data: Prisma.UserUncheckedUpdateInput) => {
    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: data
    })
    return result
}

// services/user.service.ts

const updateUserStatus = async (id: string, status: userStatus) => {

    if (!status) {
        throw new Error("Status is required, you can update just Status!.");
    }

    const result = await prisma.$transaction(async (tx) => {
        
        const user = await tx.user.findUnique({
            where: { id },
            select: { 
                role: true,
                email: true
            }
        });

        if (!user) {
            throw new Error("User not found!");
        }

        const updatedUser = await tx.user.update({
            where: { id },
            data: { status }
        });

        // প্রোভাইডার SUSPEND হলে তার সব খাবার সফট-ডিলিট (isDeleted: true) হবে
        if (user?.role === userRole.PROVIDER && status === userStatus.SUSPENDE) {
            await tx.meal.updateMany({
                where: { 
                    provider: {
                        authoremail: user?.email 
                    }
                },
                data: { 
                    isDeleted: true 
                }
            });
             await tx.provider.update({
                where: { 
                    authoremail: user?.email
                },
                data: { 
                    isDeleted: true 
                }
            });
        }

        // প্রোভাইডার আবার ACTIVE হলে তার খাবারগুলো ফেরত আসবে (isDeleted: false)
        if (user.role === userRole.PROVIDER && status === userStatus.ACTIVATE) {
            await tx.meal.updateMany({
                where: { 
                    provider: {
                        authoremail: user.email 
                    }
                },
                data: { 
                    isDeleted: false 
                }
            });
               await tx.provider.update({
                where: { 
                    authoremail: user.email
                },
                data: { 
                    isDeleted: false 
                }
            });
        }

        return updatedUser;
    });

    return result;
};


export const userService = {
    getAllUsers,
    updateCustomerProfile,
    updateUserStatus
}