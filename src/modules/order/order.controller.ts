import { Request, Response } from "express";
import { orderService } from "./order.service";


const createOrder = async(req: Request, res: Response) => {
    try {
        const body = req.body
        const result = await orderService.createOrder(body)
        res.status(200).json({  
            message: "order created successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to create order!",
            error: error.message
        })
    }   
}

const getAllOrders = async(req: Request, res: Response) => {
      try {
        console.log("user id from req", req?.user)
            const { id, role, email} = req?.user?? {}
            const data = {
                id: id as string,
                role: role as string,
                email: email as string
            }

            const result = await orderService.getAllOrders(data)
            res.status(200).json({
                message: "order retrieved successfully!",
                data: result
            })
        } catch (error: any) {
            res.status(400).json({
                message: "failed to retrieve order!",
                error: error.message
            })
        }
}



export const orderController = {
    createOrder,
    getAllOrders,
}