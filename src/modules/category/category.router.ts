import express, { Router } from "express";
import { categoryController } from "./category.controller";


const router = express.Router()

router.post('/api/v1', categoryController.createCategory)

export const categoryRouter: Router = router