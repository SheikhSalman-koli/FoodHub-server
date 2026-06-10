import express, { Router } from "express"
import { providerController } from "./provider.controller"

const router = express.Router()

router.post('/api/v1', providerController.createProvider)

router.get('/api/v1', providerController.getAllProvider)


export const providerRouter: Router = router