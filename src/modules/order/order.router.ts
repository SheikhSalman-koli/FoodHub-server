import express, { Router } from "express"
import { orderController } from "./order.controller"
import auth, { userRole } from "../../middlewares/auth"


const router = express.Router()

router.post('/api/v1', orderController.createOrder)

router.get('/api/v1', auth(userRole.ADMIN, userRole.PROVIDER, userRole.CUSTOMER), orderController.getAllOrders)


export const orderRouter: Router = router