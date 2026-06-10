import { Prisma, userStatus } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const getAllUsers =async () => {
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

const updateUser = async(id: string, data: {status?: string|undefined, isDeleted?: boolean|undefined}) => {
    const updateData: Prisma.UserUpdateInput = {}
    if (typeof data.status !== 'undefined') {
        // convert/validate incoming string to the generated enum type
        updateData.status = data.status as unknown as userStatus
    }
    if (typeof data.isDeleted !== 'undefined') {
        updateData.isDeleted = data.isDeleted
    }

    const result = await prisma.user.update({
        where: {
            id: id
        },
        data: updateData
    })
    return result
}


export const userService = {
    getAllUsers,
    updateUser
}