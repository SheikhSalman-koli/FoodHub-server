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
            const result = await orderService.getAllOrders()
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