import express, { Router } from "express"
import { userController } from "./user.controller.js"
import auth, { userRole } from "../../middlewares/auth.js"

const router = express.Router()

router.get('/user', auth(userRole.ADMIN), userController.getAllUsers)

router.get('/user/:id', auth(userRole.CUSTOMER), userController.getAUsers)

router.put('/user/update-profile/:id', auth(userRole.CUSTOMER, userRole.PROVIDER, userRole.ADMIN), userController.updateProfile)

router.patch('/update-status/:id', auth(userRole.ADMIN), userController.updateUserStatus )

router.patch('/change-password/:id', userController.changePassword )

export const userRouter: Router = router