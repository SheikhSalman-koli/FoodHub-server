import  express, { Application }  from "express"
import cors from 'cors'
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { categoryRouter } from "./modules/category/category.router"
const app: Application = express()

app.use(cors({
    origin: process.env.APP_URL || 'http//localhost:5000',
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth))

app.use(express.json())

app.use('/category', categoryRouter)

export default app