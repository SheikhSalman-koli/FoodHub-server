import express from "express";
import { mealController } from "./meal.controller.js";
import auth, { userRole } from "../../middlewares/auth.js";
const router = express.Router();
router.post('/meal', auth(userRole.PROVIDER), mealController.createmeal);
router.get('/meal', mealController.getemeals);
router.get('/meal/single/:id', mealController.getSingleMeal);
router.get('/meal/providermeal/:provideremail', auth(userRole.PROVIDER), mealController.getProviderMeals);
router.put('/meal/:id', auth(userRole.PROVIDER), mealController.editMeal);
// soft delete
router.patch('/meal/soft-delete/:id', auth(userRole.PROVIDER), mealController.softDeleteMeal);
export const mealRouter = router;
