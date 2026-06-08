import express, { Router } from "express";
import { mealController } from "./meal.controller";


const router = express.Router()

router.post('/api/v1', mealController.createmeal)

router.get('/api/v1', mealController.getemeals)

router.get('/api/v1/single/:id', mealController.getSingleMeal)

router.put('/api/v1/:id', mealController.editMeal)

// soft delete
router.patch('/api/v1/soft-delete/:id', mealController.softDeleteMeal)

export const mealRouter: Router = router