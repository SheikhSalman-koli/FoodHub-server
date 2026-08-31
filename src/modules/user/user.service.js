// import { Prisma, userStatus, Role } from "../../../generated/prisma/client.js"
import { userStatus } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { userRole } from "../../middlewares/auth.js";
import { hashPassword, verifyPassword } from "better-auth/crypto";
const getAllUsers = async () => {
    const result = await prisma.user.findMany({
        where: {
            isDeleted: false,
            role: {
                not: "ADMIN"
            }
        }
    });
    return result;
};
const getSingleUser = async (id) => {
    const result = await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            _count: {
                select: {
                    orders: true,
                    reviews: true,
                },
            },
            reviews: {
                select: {
                    id: true,
                    comment: true,
                    starCount: true,
                    createdAt: true,
                    meal: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            orders: {
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    orderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            meal: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });
    return result;
};
const updateProfile = async (userId, data) => {
    const isExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!isExist) {
        throw new Error('User not exist!');
    }
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: data
    });
    return result;
};
const updateUserStatus = async (id, status) => {
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
const changePassword = async (payload) => {
    const { userId, currentSessionId, currentPassword, confirmPassword } = payload;
    if (!currentPassword || !confirmPassword) {
        throw new Error("Both current and new passwords are required!");
    }
    if (currentPassword === confirmPassword) {
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
        password: currentPassword,
        hash: userAccount.password,
    });
    if (!isMatch) {
        throw new Error("Your current password is incorrect!");
    }
    const hashedNewPassword = await hashPassword(confirmPassword);
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
    getSingleUser,
    updateProfile,
    updateUserStatus,
    changePassword
};
