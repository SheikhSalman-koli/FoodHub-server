import { Request, Response } from "express"
import { statsService } from "./stats.service.js"

const getProviderStats = async (req: Request, res: Response) => {
    try {
        const { email } = req.params

        const result = await statsService.getProviderStats(email as string);
        res.status(200).json({
            message: "stats retrieved successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to retrieve stats!",
            error: error.message
        })
    }
}


const getAdminStats = async (req: Request, res: Response) => {
    try {
        const result = await statsService.getAdminDashboardStats()
        res.status(200).json({
            message: "stats retrieved successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to retrieve stats!",
            error: error.message
        })
    }
}

export const statsController = {
    getProviderStats,
    getAdminStats
}