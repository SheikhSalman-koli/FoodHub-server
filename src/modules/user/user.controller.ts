import { Request, Response } from "express"
import { userService } from "./user.service"



const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers()
        res.status(200).json({
            message: "users retrieved successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to retrieve users!",
            error: error.message
        })
    }
}


const updateCustomerProfile = async (req: Request, res: Response) => {
    try {

        const user = req?.user
        if (!user) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }
        const { id } = user
        const { name, image, phone } = req.body
        const updatedDate = { name, image, phone }

        const result = await userService.updateCustomerProfile(id, updatedDate)
        res.status(200).json({
            message: "Profile updated successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to update user!",
            error: error.message
        })
    }
}

const updateUserStatus = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req?.params;
        const { status } = req?.body;

        const result = await userService.updateUserStatus(id, status);

        res.status(200).json({ 
            success: true, 
            message: `User status updated to ${status}!`, 
            data: result 
        });
    } catch (error: any) {
        res.status(400).json({
            message: "failed to update user!",
            error: error.message
        })
    }
};


export const userController = {
    getAllUsers,
    updateCustomerProfile,
    updateUserStatus
}