import express, { Router } from "express"
import { statsController } from "./stats.controller"

const router = express.Router()

router.get('/stats-provider/:email', statsController.getProviderStats)

export const statsRouter: Router = router