import express, { Router } from "express";
import { categoryController } from "./category.controller";


const router = express.Router()

router.post('/api/v1', categoryController.createCategory)

router.get('/api/v1', categoryController.getAllCategories)

router.get('/api/v1/:id', categoryController.getCategoryById)

router.put('/api/v1/:id', categoryController.updateCategory)

//soft delete category
router.patch('/api/v1/:id', categoryController.softDeleteCategory)

export const categoryRouter: Router = router