import { categoryService } from "./category.service"
import { Request, Response } from 'express'

const createCategory = async(req: Request, res: Response) => {
    try {
    
    const result = await categoryService.createCategory(req?.body)
    res.status(200).json({
        message: "category created successfully!",
        data: result
    })

        
    } catch (error: any) {
        res.status(400).json({
            message: "category not created!",
            error: error.message
        })
    }
}

export const categoryController = {
    createCategory
}