import express, { Router } from "express";
import { mealController } from "./meal.controller";
import auth, { userRole } from "../../middlewares/auth";


const router = express.Router()

router.post('/meal',auth(userRole.PROVIDER), mealController.createmeal)

router.get('/meal',  mealController.getemeals)

router.get('/meal/single/:id', mealController.getSingleMeal)

router.put('/meal/:id',auth(userRole.PROVIDER), mealController.editMeal)

// soft delete
router.patch('/meal/soft-delete/:id',auth(userRole.PROVIDER), mealController.softDeleteMeal)

export const mealRouter: Router = router