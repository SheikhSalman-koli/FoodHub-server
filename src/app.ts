import  express, { Application }  from "express"
import cors from 'cors'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { categoryRouter } from "./modules/category/category.router"
import { mealRouter } from "./modules/meal/meal.router"
import { userRouter } from "./modules/user/user.router"
import { providerRouter } from "./modules/provider/provider.route"
import { orderRouter } from "./modules/order/order.router"
import { reviewRouter } from "./modules/review/review.router"
import { statsRouter } from "./modules/stats/stats.router"

const app: Application = express()

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

app.use('/api/v1', categoryRouter)

app.use('/api/v1', mealRouter)

app.use('/user', userRouter)

app.use('/api/v1', providerRouter)

app.use('/api/v1', orderRouter)

app.use('/review', reviewRouter)

app.use('/api/v1', statsRouter)

export default app