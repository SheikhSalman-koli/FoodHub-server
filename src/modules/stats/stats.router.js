import express from "express";
import { statsController } from "./stats.controller.js";
import auth, { userRole } from "../../middlewares/auth.js";
const router = express.Router();
router.get('/stats-provider/:email', statsController.getProviderStats);
router.get('/admin/dashboard/stats', auth(userRole.ADMIN), statsController.getAdminStats);
export const statsRouter = router;
