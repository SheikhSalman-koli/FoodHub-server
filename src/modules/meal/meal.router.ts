import express, { Router } from "express";
import { mealController } from "./meal.controller";


const router = express.Router()

router.post('/api/v1', mealController.createmeal)

export const mealRouter: Router = router