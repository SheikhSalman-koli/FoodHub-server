import express, { Router } from "express"
import { providerController } from "./provider.controller"

const router = express.Router()

router.post('/provider', providerController.createProvider)

router.get('/provider', providerController.getAllProvider)

router.get('/provider/:id', providerController.getSingleProvider)


export const providerRouter: Router = router