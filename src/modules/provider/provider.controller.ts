import { Request, Response } from "express";
import { providerService } from "./provider.service";



const createProvider = async(req: Request, res: Response) => {
    try {
        const body = req.body
        const result = await providerService.createProvider(body)
        res.status(200).json({  
            message: "provider created successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to create provider!",
            error: error.message
        })
    }   
}

const getAllProvider = async(req: Request, res: Response) => {
      try {
            const result = await providerService.getAllProvider()
            res.status(200).json({
                message: "provider retrieved successfully!",
                data: result
            })
        } catch (error: any) {
            res.status(400).json({
                message: "failed to retrieve provider!",
                error: error.message
            })
        }
}

const getSingleProvider = async(req: Request<{id: string}>, res: Response) => {
      try {
            const { id } = req?.params
            const result = await providerService.getSingleProvider(id)
            res.status(200).json({
                message: "provider retrieved successfully!",
                data: result
            })
        } catch (error: any) {
            res.status(400).json({
                message: "failed to retrieve provider!",
                error: error.message
            })
        }
}



export const providerController = {
    createProvider,
    getAllProvider,
    getSingleProvider
}