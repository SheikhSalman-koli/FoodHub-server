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
import { prisma } from "./lib/prisma.js";
import { randomBytes } from "node:crypto";
const app = express();
app.use(cors({
    origin: process.env.APP_URL || "https://shei-shad-client.vercel.app",
    credentials: true,
}));
app.get("/", (req, res) => {
    res.json({
        message: "Hello world!",
        version: "DEBUG-TEST-1",
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
// app.get("/debug-auth-user", async (req, res) => {
//   console.log(
//     "DB HOST:",
//     process.env.DATABASE_URL
//       ? new URL(process.env.DATABASE_URL).hostname
//       : "DATABASE_URL MISSING"
//   );
//   console.log(
//     "DB NAME:",
//     process.env.DATABASE_URL
//       ? new URL(process.env.DATABASE_URL).pathname
//       : "DATABASE_URL MISSING"
//   );
//   const email = "assalmanmuhammad@gmail.com";
//   const user = await prisma.user.findUnique({
//     where: {
//       email,
//     },
//   });
//   res.json({
//     found: !!user,
//     email: user?.email ?? null,
//   });
// });
app.post("/api/admin/reset-fake-email-password", async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // ১. একটি র্যান্ডম সিকিউর টোকেন জেনারেট করা
        const resetToken = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ১ ঘণ্টার মেয়াদ
        // // ২. Verification টেবিলে পাসওয়ার্ড রিসেট টোকেন সেভ করা
        // await prisma.verification.create({
        //   data: {
        //     identifier: email,
        //     value: resetToken,
        //     expiresAt: expiresAt,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //   },
        // });
        // ৩. Better Auth-এর Native resetPassword API কল করা
        await auth.api.resetPassword({
            body: {
                newPassword: newPassword,
                token: resetToken,
            },
        });
        // ৪. ইমেইল ভেরিফাইড এবং অ্যাকাউন্ট সক্রিয় করা
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                status: "ACTIVATE",
                isDeleted: false,
            },
        });
        return res.json({
            success: true,
            message: "Password updated successfully using resetPassword flow!",
        });
    }
    catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ error: error.message });
    }
});
export default app;
