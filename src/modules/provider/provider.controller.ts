import { Request, Response } from "express";
import { providerService } from "./provider.service.js";

const createProvider = async(req: Request, res: Response) => {
    try {
        const body = req.body
        const result = await providerService.createProvider(body)
        res.status(200).json({ 
            success: true, 
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

const getProviderByEmail = async(req: Request<{email: string}>, res: Response) => {
      try {
            const { email } = req?.params
            const result = await providerService.getProviderByEmail(email)
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


const updateProvider = async(req: Request<{id: string}>, res: Response) => {
      try {
            const { id } = req?.params
            const result = await providerService.updateProvider(id, req.body)
            res.status(200).json({
                message: "provider updated successfully!",
                data: result
            })
        } catch (error: any) {
            res.status(400).json({
                message: "failed to update provider!",
                error: error.message
            })
        }
}



export const providerController = {
    createProvider,
    getAllProvider,
    getSingleProvider,
    getProviderByEmail,
    updateProvider
}