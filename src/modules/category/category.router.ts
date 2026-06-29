import express, { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { userRole } from "../../middlewares/auth";


const router = express.Router()

router.post('/category', auth(userRole.ADMIN), categoryController.createCategory)

router.get('/category', categoryController.getAllCategories)

router.get('/category/:id', categoryController.getCategoryById)

router.put('/category/:id',auth(userRole.ADMIN), categoryController.updateCategory)

//soft delete category
router.patch('/category/:id',auth(userRole.ADMIN), categoryController.softDeleteCategory)

export const categoryRouter: Router = router