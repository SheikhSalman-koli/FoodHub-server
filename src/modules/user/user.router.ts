import express, { Router } from "express"
import { userController } from "./user.controller"
import auth, { userRole } from "../../middlewares/auth"

const router = express.Router()

router.get('/api/v1', auth(userRole.ADMIN), userController.getAllUsers)

router.put('/update-profile/api/v1/', auth(userRole.CUSTOMER), userController.updateCustomerProfile)

router.patch('/update-status/api/v1/:id', auth(userRole.ADMIN), userController.updateUserStatus )


export const userRouter: Router = router