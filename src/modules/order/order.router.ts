import express, { Router } from "express"
import { orderController } from "./order.controller"
import auth, { userRole } from "../../middlewares/auth"


const router = express.Router()

router.post('/order',auth(userRole.ADMIN, userRole.PROVIDER, userRole.CUSTOMER), orderController.createOrder)

router.get('/order', auth(userRole.ADMIN, userRole.PROVIDER, userRole.CUSTOMER), orderController.getAllOrders)

router.get('/order/:id', auth(userRole.ADMIN, userRole.PROVIDER, userRole.CUSTOMER), orderController.getSingleOrder)

router.patch('/update-status/order/:orderId', auth(userRole.CUSTOMER, userRole.PROVIDER), orderController.updateOrderStatus)


export const orderRouter: Router = router