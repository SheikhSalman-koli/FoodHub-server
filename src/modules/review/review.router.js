import express from 'express';
import { reviewController } from './review.controller.js';
const router = express.Router();
router.post('/review', reviewController.createReview);
router.get('/review', reviewController.getAllReviews);
export const reviewRouter = router;
