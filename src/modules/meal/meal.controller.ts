
import { Request, Response } from 'express'
import { mealService } from './meal.service'

const createmeal = async(req: Request, res: Response) => {
    try {
    
    const result = await mealService.createmeal(req?.body)
    res.status(200).json({
        message: "meal created successfully!",
        data: result
    })

        
    } catch (error: any) {
        res.status(400).json({
            message: "meal not created!",
            error: error.message
        })
    }
}

export const mealController = {
    createmeal
}