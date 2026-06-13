import { Request, Response } from "express"
import { userService } from "./user.service"



const getAllUsers = async(req: Request, res: Response) => {
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


const updateUser = async(req: Request<{id: string}>, res: Response) => {
    try {
        const { id } = req.params
        const {  status, isDeleted, role } = req.body   
        const data = {status, isDeleted, role} 
        const result = await userService.updateUser(id, data)
        res.status(200).json({
            message: "user updated successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to update user!",
            error: error.message
        })
    }
}


export const userController = {
    getAllUsers,
    updateUser
}