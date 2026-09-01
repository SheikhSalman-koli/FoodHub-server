import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { categoryRouter } from "./modules/category/category.router.js";
import { mealRouter } from "./modules/meal/meal.router.js";
import { userRouter } from "./modules/user/user.router.js";
import { providerRouter } from "./modules/provider/provider.route.js";
import { orderRouter } from "./modules/order/order.router.js";
import { reviewRouter } from "./modules/review/review.router.js";
import { statsRouter } from "./modules/stats/stats.router.js";
const app = express();
app.use(cors({
    origin: process.env.APP_URL || "https://shei-shad-client.vercel.app",
    credentials: true,
}));
app.get("/", (req, res) => {
    res.json({
        message: "Hello world!",
    });
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use("/api/v1", categoryRouter);
app.use("/api/v1", mealRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", providerRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", statsRouter);
export default app;
