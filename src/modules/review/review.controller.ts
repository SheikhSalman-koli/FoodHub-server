import { Request, Response } from 'express'
import { reviewService } from './review.service'

const createReview = async(req: Request, res: Response) => {
    try {
        const result = await reviewService.createReview(req?.body)
        res.status(200).json({
            message: "review created successfully!",
            data: result
        })
    } catch (error: any) {
        res.status(400).json({
            message: "failed to create review!",
            error: error.message
        })
    }
}



export const reviewController = {
    createReview,
}