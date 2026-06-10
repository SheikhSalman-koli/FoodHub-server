import express, { Router } from "express"
import { orderController } from "./order.controller"


const router = express.Router()

router.post('/api/v1', orderController.createOrder)

router.get('/api/v1', orderController.getAllOrders)


export const orderRouter: Router = router