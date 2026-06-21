import express, { Router } from "express";
import { mealController } from "./meal.controller";
import auth, { userRole } from "../../middlewares/auth";


const router = express.Router()

router.post('/api/v1',auth(userRole.PROVIDER), mealController.createmeal)

router.get('/api/v1',  mealController.getemeals)

router.get('/api/v1/single/:id', mealController.getSingleMeal)

router.put('/api/v1/:id',auth(userRole.PROVIDER), mealController.editMeal)

// soft delete
router.patch('/api/v1/soft-delete/:id',auth(userRole.PROVIDER), mealController.softDeleteMeal)

export const mealRouter: Router = router