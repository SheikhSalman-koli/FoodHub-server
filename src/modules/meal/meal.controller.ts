
import { Request, Response } from 'express'
import { mealService } from './meal.service'

const createmeal = async (req: Request, res: Response) => {
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


const getemeals = async (req: Request, res: Response) => {
    try {

        const result = await mealService.getemeals()
        res.status(200).json({
            message: "meal retrived successfully!",
            data: result
        })

    } catch (error: any) {
        res.status(400).json({
            message: "meal not retrived!",
            error: error.message
        })
    }
}



const getSingleMeal = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req?.params
        const result = await mealService.getSingleMeal(id)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Meal not found or no longer available",
            });
        }
        res.status(200).json({
            message: "meal retrieved successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "no meal found!",
            error: error?.message
        })
    }
}


const editMeal = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req?.params
        const updatedData = req?.body
        // console.log(id, updatedData);
        const result = await mealService.editMeal(id, updatedData)
        res.status(200).json({
            message: "meal edited successfully!",
            data: result
        })

    } catch (error: any) {
        res.status(400).json({
            message: "meal not edited!",
            error: error?.message
        })
    }
}


const softDeleteMeal = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req?.params
        const updatedData = req?.body
        // console.log(id, updatedData);
        const result = await mealService.softDeleteMeal(id, updatedData)
        res.status(200).json({
            message: "meal deleted successfully!",
            data: result
        })

    } catch (error: any) {
        res.status(400).json({
            message: "meal not deleted!",
            error: error?.message
        })
    }
}




export const mealController = {
    createmeal,
    getemeals,
    getSingleMeal,
    editMeal,
    softDeleteMeal
}