import express from "express";
import { categoryController } from "./category.controller.js";
import auth, { userRole } from "../../middlewares/auth.js";
const router = express.Router();
router.post('/category', auth(userRole.ADMIN), categoryController.createCategory);
router.get('/all-category', auth(userRole.ADMIN), categoryController.getAllCategories);
router.get('/available-category', categoryController.getAvailableCategories);
router.get('/category/:id', categoryController.getCategoryById);
router.put('/category/:id', auth(userRole.ADMIN), categoryController.updateCategory);
//soft delete category
router.patch('/category/:id', auth(userRole.ADMIN), categoryController.softDeleteCategory);
export const categoryRouter = router;
