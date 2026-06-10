import express, { Router } from "express"
import { userController } from "./user.controller"

const router = express.Router()

router.get('/api/v1', userController.getAllUsers)

router.patch('/api/v1/:id', userController.updateUser)

export const userRouter: Router = router