import express, { Router } from "express"
import { userController } from "./user.controller"
import auth, { userRole } from "../../middlewares/auth"

const router = express.Router()

router.get('/user', auth(userRole.ADMIN), userController.getAllUsers)

router.get('/user/:id', auth(userRole.CUSTOMER), userController.getAUsers)

router.put('/user/update-profile/:id', auth(userRole.CUSTOMER, userRole.PROVIDER, userRole.ADMIN), userController.updateProfile)

router.patch('/update-status/:id', auth(userRole.ADMIN), userController.updateUserStatus )

router.patch('/change-password/:id', auth(userRole.CUSTOMER, userRole.PROVIDER, userRole.ADMIN), userController.changePassword )

export const userRouter: Router = router