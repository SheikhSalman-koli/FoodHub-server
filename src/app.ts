import  express, { Application }  from "express"
import cors from 'cors'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { categoryRouter } from "./modules/category/category.router"
import { mealRouter } from "./modules/meal/meal.router"
import { userRouter } from "./modules/user/user.router"
import { providerRouter } from "./modules/provider/provider.route"
import { orderRouter } from "./modules/order/order.router"
const app: Application = express()

app.use(cors({
    origin: process.env.APP_URL || 'http//localhost:5000',
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

app.use('/category', categoryRouter)

app.use('/meal', mealRouter)

app.use('/user', userRouter)

app.use('/provider', providerRouter)

app.use('/order', orderRouter)

export default app