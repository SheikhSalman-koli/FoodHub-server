
import { Prisma, userStatus, Role } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { userRole } from "../../middlewares/auth"
import { hashPassword, verifyPassword } from "better-auth/crypto"


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


const updateProfile = async (userId: string , data: Prisma.UserUncheckedUpdateInput) => {

    const isExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!isExist){
        throw new Error('User not exist!')
    }

    const result = await prisma.user.update({
        where: {
            id: userId
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



const changePassword = async (payload: { userId: string; currentSessionId: string; currentPassword: string; newPassword: string }) => {
  const { userId, currentSessionId, currentPassword, newPassword } = payload;

  if (!currentPassword || !newPassword) {
    throw new Error("Both current and new passwords are required!");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password cannot be the same as current password!");
  }

  const userAccount = await prisma.account.findFirst({
    where: { 
      userId: userId 
    },
    select: {
      id: true,
      password: true 
    }
  });



  if (!userAccount || !userAccount.password) {
    throw new Error("This account doesn't have a password set. (Logged in via Google?)");
  }

 const isMatch = await verifyPassword({
    password: currentPassword, // ইউজারের দেওয়া পাসওয়ার্ড
    hash: userAccount.password, // ডাটাবেজের Scrypt হ্যাশ
  });
  if (!isMatch) {
    throw new Error("Your current password is incorrect!");
  }

const hashedNewPassword = await hashPassword(newPassword);

await prisma.$transaction(async (tx) => {
  await tx.account.update({
    where: { 
      id: userAccount.id 
    },
    data: {
      password: hashedNewPassword
    }
  });

  await tx.session.deleteMany({
    where: {
      userId: userId,
      id: {
        not: currentSessionId 
      }
    }
  });
  
});

};


export const userService = {
    getAllUsers,
    updateProfile,
    updateUserStatus,
    changePassword
}