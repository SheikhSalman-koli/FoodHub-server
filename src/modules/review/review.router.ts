import express from 'express'
import { reviewController } from './review.controller'

const router = express.Router()

router.post('/api/v1', reviewController.createReview)



export const reviewRouter = router