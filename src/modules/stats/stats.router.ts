import express, { Router } from "express"
import { statsController } from "./stats.controller"
import auth, { userRole } from "../../middlewares/auth"

const router = express.Router()

router.get('/stats-provider/:email', statsController.getProviderStats)

router.get('/admin/dashboard/stats', auth(userRole.ADMIN), statsController.getAdminStats)

export const statsRouter: Router = router