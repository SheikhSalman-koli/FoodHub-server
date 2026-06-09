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


const getAllCategories = async(req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategories()
        res.status(200).json({
            message: "categories retrieved successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to retrieve categories!",
            error: error.message
        })
    }
}

const getCategoryById = async(req: Request<{id: string}>, res: Response) => {
    try {
        const { id } = req.params
        const result = await categoryService.getCategoryById(id)
        res.status(200).json({
            message: "category retrieved successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to retrieve category!",
            error: error.message
        })
    }
}


const updateCategory = async(req: Request<{id: string}>, res: Response) => {
    try {
        const { id } = req.params
        const categoryData = req.body

        const result = await categoryService.updateCategory(id, categoryData)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "category not found!"
            })
        }

        res.status(200).json({
            message: "category updated successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to update category!",
            error: error.message
        })
    }
}


const softDeleteCategory = async(req: Request<{id: string}>, res: Response) => {
    try {
        const { id } = req.params
        const updatedData = req.body
        const result = await categoryService.softDeleteCategory(id, updatedData)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "category not found!"
            })
        }

        res.status(200).json({
            message: "category deleted successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to delete category!",
            error: error.message
        })
    }
}


export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    softDeleteCategory
}